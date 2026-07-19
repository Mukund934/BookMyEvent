import { Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth.middleware";
import redis from "../config/redis";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const bookEvent = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const { eventId, seats } = req.body;

		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		if (!eventId || !seats || seats <= 0) {
			throw new ApiError(400, "Invalid request");
		}

		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			throw new ApiError(400, "Invalid event id");
		}

		const session = await mongoose.startSession();

		let booking;
		let event;

		try {
			session.startTransaction();

			// prevent duplicate booking
			const existing = await Booking.findOne({
				user: req.user.userId,
				event: eventId,
				status: "active",
			}).session(session);

			if (existing) {
				throw new ApiError(409, "Already booked this event");
			}

			// atomic seat decrement
			event = await Event.findOneAndUpdate(
				{
					_id: eventId,
					availableSeats: { $gte: seats },
				},
				{ $inc: { availableSeats: -seats } },
				{ new: true, session },
			);

			if (!event) {
				throw new ApiError(400, "Not enough seats available");
			}

			// create booking
			booking = await Booking.create(
				[
					{
						user: req.user.userId,
						event: eventId,
						seatsBooked: seats,
						totalAmount: event.price * seats,
						status: "active",
					},
				],
				{ session },
			);

			await session.commitTransaction();
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}

			throw error;
		} finally {
			session.endSession();
		}

		const keys = await redis.keys(`bookings:user:${req.user.userId}:*`);

		if (keys.length) {
			await redis.del(...keys);
		}
		await redis.del(`analytics:${eventId}`);

		await redis.del(`event:${eventId}`);

		const eventKeys = await redis.keys("events:*");

		if (eventKeys.length) {
			await redis.del(...eventKeys);
		}

		await redis.del(`dashboard:overview:${event.organizer}`);

		res.status(201).json({
			success: true,
			message: "Booking successful",
			data: booking[0],
		});
	},
);

export const getMyBookings = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const cacheKey = `bookings:user:${req.user.userId}:p:${req.query.page || 1}`;

		//  cache check
		const cached = await redis.get(cacheKey);

		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				...JSON.parse(cached),
			});
		}

		const { page, limit, skip } = getPagination(req.query as any);

		const bookings = await Booking.find({
			user: req.user.userId,
		})
			.populate("event")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Booking.countDocuments({
			user: req.user.userId,
		});

		const response = {
			bookings,
			total,
			page,
			totalPages: Math.ceil(total / limit),
		};

		await redis.set(cacheKey, JSON.stringify(response), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			...response,
		});
	},
);

export const cancelBooking = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		const rawId = req.params.bookingId;
		const bookingId = Array.isArray(rawId) ? rawId[0] : rawId;

		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
			throw new ApiError(400, "Invalid booking id");
		}

		const session = await mongoose.startSession();

		let booking;

		try {
			session.startTransaction();

			booking = await Booking.findById(bookingId).session(session);

			if (!booking) {
				throw new ApiError(404, "Booking not found");
			}

			if (booking.user.toString() !== req.user.userId) {
				throw new ApiError(403, "Forbidden");
			}

			if (booking.status === "cancelled") {
				throw new ApiError(400, "Already cancelled");
			}

			// restore seats
			await Event.findByIdAndUpdate(
				booking.event,
				{
					$inc: { availableSeats: booking.seatsBooked },
				},
				{ session },
			);

			booking.status = "cancelled";
			await booking.save({ session });

			await session.commitTransaction();
		} catch (error) {
			if (session.inTransaction()) {
				await session.abortTransaction();
			}

			throw error;
		} finally {
			session.endSession();
		}

		const keys = await redis.keys(`bookings:user:${req.user.userId}:*`);

		if (keys.length) {
			await redis.del(...keys);
		}
		await redis.del(`analytics:${booking.event}`);

		await redis.del(`event:${booking.event}`);

		const eventKeys = await redis.keys("events:*");

		if (eventKeys.length) {
			await redis.del(...eventKeys);
		}

		const eventDoc = await Event.findById(booking.event);

		if (eventDoc) {
			await redis.del(`dashboard:overview:${eventDoc.organizer}`);
		}

		res.status(200).json({
			success: true,
			message: "Booking cancelled successfully",
			data: booking,
		});
	},
);

function getPagination(query: any): {
	page: number;
	limit: number;
	skip: number;
} {
	const page = Math.max(parseInt(query?.page as string, 10) || 1, 1);
	const limit = Math.max(parseInt(query?.limit as string, 10) || 10, 1);
	const skip = (page - 1) * limit;

	return { page, limit, skip };
}
