import { Request, Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth.middleware";
import redis from "../config/redis";

export const bookEvent = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const { eventId, seats } = req.body;

		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		if (!eventId || !seats || seats <= 0) {
			res.status(400).json({ message: "Invalid request" });
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			res.status(400).json({ message: "Invalid event id" });
			return;
		}

		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			const existing = await Booking.findOne({
				user: req.user.userId,
				event: eventId,
			}).session(session);

			if (existing) {
				await session.abortTransaction();
				session.endSession();

				res.status(409).json({ message: "Already booked this event" });
				return;
			}

			const event = await Event.findOneAndUpdate(
				{
					_id: eventId,
					availableSeats: { $gte: seats },
				},
				{ $inc: { availableSeats: -seats } },
				{ new: true, session },
			);

			if (!event) {
				await session.abortTransaction();
				session.endSession();

				res.status(400).json({ message: "Not enough seats available" });
				return;
			}

			const booking = await Booking.create(
				[
					{
						user: req.user.userId,
						event: eventId,
						seatsBooked: seats,
						totalAmount: event.price * seats,
					},
				],
				{ session },
			);

			await session.commitTransaction();
			session.endSession();

			await redis.del(`analytics:${eventId}`);

			res.status(201).json({
				message: "Booking successful",
				booking: booking[0],
			});
			return;
		} catch (err) {
			await session.abortTransaction();
			session.endSession();
			throw err;
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

export const getMyBookings = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const bookings = await Booking.find({
			user: req.user.userId,
		})
			.populate("event")
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: bookings.length,
			data: bookings,
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};

export const cancelBooking = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const rawId = req.params.bookingId;

		const bookingId = Array.isArray(rawId) ? rawId[0] : rawId;

		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
			res.status(400).json({ message: "Invalid booking id" });
			return;
		}

		const booking = await Booking.findById(bookingId);

		if (!booking) {
			res.status(404).json({ message: "Booking not found" });
			return;
		}

		if (booking.user.toString() !== req.user.userId) {
			res.status(403).json({ message: "Forbidden" });
			return;
		}

		if (booking.status === "cancelled") {
			res.status(400).json({ message: "Already cancelled" });
			return;
		}

		await Event.findByIdAndUpdate(booking.event, {
			$inc: { availableSeats: booking.seatsBooked },
		});

		booking.status = "cancelled";
		await booking.save();

		await redis.del(`analytics:${booking.event}`);

		res.status(200).json({
			message: "Booking cancelled successfully",
			data: booking,
		});
		return;
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
		return;
	}
};