import { Request, Response } from "express";
import mongoose from "mongoose";

import Event from "../models/Event";
import Booking from "../models/Booking";

import { AuthRequest } from "../middleware/auth.middleware";
import { validateObjectId } from "../utils/validateId";

import redis from "../config/redis";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import {
	bumpCacheVersion,
	getCacheVersion,
} from "../utils/cacheVersion";

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

		await bumpCacheVersion("events");

		await bumpCacheVersion(`dashboard:${req.user.userId}`);

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
			const search = location
				.slice(0, 100)
				.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

			filter.location = { $regex: search, $options: "i" };
		}

		if (date && typeof date === "string") {
			filter.date = new Date(date);
		}

		const version = await getCacheVersion("events");

		const cacheKey = `events:${version}:${page}:${limit}:${location || "all"}:${date || "all"}`;

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
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const rawId = req.params.id;

		if (!rawId || Array.isArray(rawId)) {
			throw new ApiError(400, "Event id required");
		}

		const id = validateObjectId(rawId);

		if (!id) throw new ApiError(400, "Invalid event id");

		const event = await Event.findById(id);

		if (!event) throw new ApiError(404, "Event not found");

		if (event.organizer.toString() !== req.user.userId) {
			throw new ApiError(403, "Forbidden");
		}

		const cacheKey = `analytics:${id}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				data: JSON.parse(cached),
				cached: true,
			});
		}

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

export const updateEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const id = validateObjectId(req.params.id);

		if (!id) {
			throw new ApiError(400, "Invalid event id");
		}

		const event = await Event.findById(id);

		if (!event) {
			throw new ApiError(404, "Event not found");
		}

		if (event.organizer.toString() !== req.user.userId) {
			throw new ApiError(403, "Forbidden");
		}

		const { title, description, date, location, price, totalSeats } =
			req.body;

		if (totalSeats != null) {
			const bookedSeats = event.totalSeats - event.availableSeats;

			if (Number(totalSeats) < bookedSeats) {
				throw new ApiError(
					400,
					`Total seats cannot be below the ${bookedSeats} already booked`,
				);
			}

			event.availableSeats = Number(totalSeats) - bookedSeats;
			event.totalSeats = Number(totalSeats);
		}

		if (title != null) event.title = title;
		if (description != null) event.description = description;
		if (location != null) event.location = location;
		if (date != null) event.date = date;
		if (price != null) event.price = Number(price);

		await event.save();

		await redis.del(`event:${id}`);

		await redis.del(`analytics:${id}`);

		await bumpCacheVersion("events");

		await bumpCacheVersion(`dashboard:${req.user.userId}`);

		res.status(200).json({
			success: true,
			message: "Event updated successfully",
			data: event,
		});
	},
);

export const deleteEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const id = validateObjectId(req.params.id);

		if (!id) {
			throw new ApiError(400, "Invalid event id");
		}

		const event = await Event.findById(id);

		if (!event) {
			throw new ApiError(404, "Event not found");
		}

		if (event.organizer.toString() !== req.user.userId) {
			throw new ApiError(403, "Forbidden");
		}

		const activeBookings = await Booking.countDocuments({
			event: id,
			status: "active",
		});

		if (activeBookings > 0) {
			throw new ApiError(
				409,
				`Cannot delete an event with ${activeBookings} active booking(s)`,
			);
		}

		await event.deleteOne();

		await redis.del(`event:${id}`);

		await redis.del(`analytics:${id}`);

		await bumpCacheVersion("events");

		await bumpCacheVersion(`dashboard:${req.user.userId}`);

		res.status(200).json({
			success: true,
			message: "Event deleted successfully",
		});
	},
);
