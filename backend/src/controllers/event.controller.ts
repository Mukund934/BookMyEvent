import { Request, Response } from "express";
import mongoose from "mongoose";

import Event from "../models/Event";
import Booking from "../models/Booking";

import { AuthRequest } from "../middleware/auth.middleware";
import { validateObjectId } from "../utils/validateId";

export const createEvent = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const { title, description, date, location, price, totalSeats } =
			req.body;

		// auth check
		if (!req.user) {
			res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
			return;
		}

		// validation
		if (
			!title ||
			!description ||
			!date ||
			!location ||
			price == null ||
			totalSeats == null
		) {
			res.status(400).json({
				success: false,
				message: "All fields are required",
			});
			return;
		}

		if (Number(price) < 0 || Number(totalSeats) <= 0) {
			res.status(400).json({
				success: false,
				message: "Invalid numeric values",
			});
			return;
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

		res.status(201).json({
			success: true,
			message: "Event created successfully",
			data: event,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const getAllEvents = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.min(50, Number(req.query.limit) || 10);
		const skip = (page - 1) * limit;

		const { location, date } = req.query;

		const filter: any = {};

		if (location && typeof location === "string") {
			filter.location = {
				$regex: location,
				$options: "i",
			};
		}

		if (date && typeof date === "string") {
			filter.date = new Date(date);
		}

		const [events, total] = await Promise.all([
			Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

			Event.countDocuments(filter),
		]);

		res.status(200).json({
			success: true,
			data: {
				events,
				pagination: {
					page,
					limit,
					totalPages: Math.ceil(total / limit),
					totalEvents: total,
				},
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const getEventById = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const id = validateObjectId(req.params.id);

		if (!id) {
			res.status(400).json({
				success: false,
				message: "Invalid event id",
			});
			return;
		}

		const event = await Event.findById(id).populate(
			"organizer",
			"name email",
		);

		if (!event) {
			res.status(404).json({
				success: false,
				message: "Event not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			data: event,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const getEventAnalytics = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const id = validateObjectId(req.params.id);

		if (!id) {
			res.status(400).json({
				success: false,
				message: "Invalid event id",
			});
			return;
		}

		const event = await Event.findById(id);

		if (!event) {
			res.status(404).json({
				success: false,
				message: "Event not found",
			});
			return;
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

		const analytics = stats[0] ?? {
			totalBookings: 0,
			totalSeatsBooked: 0,
			totalRevenue: 0,
		};

		const occupancyRate =
			event.totalSeats > 0
				? (analytics.totalSeatsBooked / event.totalSeats) * 100
				: 0;

		res.status(200).json({
			success: true,
			data: {
				eventId: event._id,
				title: event.title,
				totalSeats: event.totalSeats,
				bookedSeats: analytics.totalSeatsBooked,
				availableSeats: event.availableSeats,
				totalRevenue: analytics.totalRevenue,
				bookingCount: analytics.totalBookings,
				occupancyRate: Number(occupancyRate.toFixed(2)),
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
