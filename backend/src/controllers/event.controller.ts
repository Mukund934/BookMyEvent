import { Request, Response } from "express";
import mongoose from "mongoose";

import Event from "../models/Event";
import Booking from "../models/Booking";

import { AuthRequest } from "../middleware/auth.middleware";
import { validateObjectId } from "../utils/validateId";

import redis from "../config/redis";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const createEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const { title, description, date, location, price, totalSeats } =
			req.body;

		if (
			!title ||
			!description ||
			!date ||
			!location ||
			price == null ||
			totalSeats == null
		) {
			throw new ApiError(400, "All fields are required");
		}

		if (Number(price) < 0 || Number(totalSeats) <= 0) {
			throw new ApiError(400, "Invalid numeric values");
		}

		const event = await Event.create({
			title,
			description,
			date,
			location,
			price: Number(price),
			totalSeats: Number(totalSeats),
			availableSeats: Number(totalSeats),
			organizer: req.user.userId,
		});

		const eventKeys = await redis.keys("events:*");

		if (eventKeys.length) {
			await redis.del(...eventKeys);
		}

		await redis.del(`dashboard:overview:${req.user.userId}`);

		res.status(201).json({
			success: true,
			message: "Event created successfully",
			data: event,
		});
	},
);

export const getAllEvents = asyncHandler(
	async (req: Request, res: Response) => {
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.min(50, Number(req.query.limit) || 10);
		const skip = (page - 1) * limit;

		const { location, date } = req.query;

		const filter: any = {};

		if (location && typeof location === "string") {
			filter.location = { $regex: location, $options: "i" };
		}

		if (date && typeof date === "string") {
			filter.date = new Date(date);
		}

		const cacheKey = `events:${page}:${limit}:${location || "all"}:${date || "all"}`;

		const cached = await redis.get(cacheKey);

		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const [events, total] = await Promise.all([
			Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Event.countDocuments(filter),
		]);

		const responseData = {
			events,
			pagination: {
				page,
				limit,
				totalPages: Math.ceil(total / limit),
				totalEvents: total,
			},
		};
		await redis.set(cacheKey, JSON.stringify(responseData), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: responseData,
		});
	},
);

export const getEventById = asyncHandler(
	async (req: Request, res: Response) => {
		const id = validateObjectId(req.params.id);

		if (!id) {
			throw new ApiError(400, "Invalid event id");
		}

		const cacheKey = `event:${id}`;

		const cached = await redis.get(cacheKey);

		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const event = await Event.findById(id).populate(
			"organizer",
			"name email",
		);

		if (!event) {
			throw new ApiError(404, "Event not found");
		}

		await redis.set(cacheKey, JSON.stringify(event), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: event,
		});
	},
);

export const getEventAnalytics = asyncHandler(
	async (req: Request, res: Response) => {
		const rawId = req.params.id;

		if (!rawId || Array.isArray(rawId)) {
			throw new ApiError(400, "Event id required");
		}

		const id = validateObjectId(rawId);

		if (!id) throw new ApiError(400, "Invalid event id");

		const cacheKey = `analytics:${id}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				data: JSON.parse(cached),
				cached: true,
			});
		}

		const event = await Event.findById(id);

		if (!event) throw new ApiError(404, "Event not found");

		const stats = await Booking.aggregate([
			{
				$match: {
					event: new mongoose.Types.ObjectId(id),
					status: "active",
				},
			},
			{
				$group: {
					_id: "$event",
					totalBookings: { $sum: 1 },
					totalSeatsBooked: { $sum: "$seatsBooked" },
					totalRevenue: { $sum: "$totalAmount" },
				},
			},
		]);

		const analytics = stats[0] || {
			totalBookings: 0,
			totalSeatsBooked: 0,
			totalRevenue: 0,
		};

		const occupancyRate =
			event.totalSeats > 0
				? (analytics.totalSeatsBooked / event.totalSeats) * 100
				: 0;

		const responseData = {
			eventId: event._id,
			title: event.title,
			totalSeats: event.totalSeats,
			bookedSeats: analytics.totalSeatsBooked,
			availableSeats: event.availableSeats,
			totalRevenue: analytics.totalRevenue,
			bookingCount: analytics.totalBookings,
			occupancyRate: Number(occupancyRate.toFixed(2)),
		};

		await redis.setex(cacheKey, 60, JSON.stringify(responseData));

		res.status(200).json({
			success: true,
			data: responseData,
		});
	},
);
