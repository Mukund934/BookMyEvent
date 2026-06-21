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
			res.status(400).json({
				message: "Invalid event id",
			});
			return;
		}

		//  prevent duplicate booking
		const existing = await Booking.findOne({
			user: req.user.userId,
			event: eventId,
		});

		if (existing) {
			res.status(409).json({
				message: "Already booked this event",
			});
			return;
		}

		// ATOMIC seat reduction

		const event = await Event.findOneAndUpdate(
			{
				_id: eventId,
				availableSeats: { $gte: seats },
			},
			{
				$inc: { availableSeats: -seats },
			},
			{ new: true },
		);

		if (!event) {
			res.status(400).json({
				message: "Not enough seats available",
			});
			return;
		}

		const totalAmount = event.price * seats;

		const booking = await Booking.create({
			user: req.user.userId,
			event: eventId,
			seatsBooked: seats,
			totalAmount,
		});

		await redis.del(`analytics:${eventId}`);

		res.status(201).json({
			message: "Booking successful",
			booking,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getMyBookings = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({
				message: "Unauthorized",
			});
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
			bookings,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};

export const cancelBooking = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const bookingId = req.params.bookingId;

		if (!bookingId || typeof bookingId !== "string") {
			res.status(400).json({
				message: "Invalid booking id",
			});
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(bookingId)) {
			res.status(400).json({
				message: "Invalid booking id",
			});
			return;
		}

		if (!req.user) {
			res.status(401).json({
				message: "Unauthorized",
			});
			return;
		}

		const booking = await Booking.findById(bookingId);

		if (!booking) {
			res.status(404).json({
				message: "Booking not found",
			});
			return;
		}

		// user can only cancel own booking
		if (booking.user.toString() !== req.user.userId) {
			res.status(403).json({
				message: "Forbidden",
			});
			return;
		}

		if (booking.status === "cancelled") {
			res.status(400).json({
				message: "Booking already cancelled",
			});
			return;
		}

		// restore seats
		await Event.findByIdAndUpdate(
			booking.event,
			{
				$inc: {
					availableSeats: booking.seatsBooked,
				},
			},
			{ new: true },
		);

		booking.status = "cancelled";
		await booking.save();

		await redis.del(`analytics:${booking.event}`);

		res.status(200).json({
			message: "Booking cancelled successfully",
			booking,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Server error",
		});
	}
};
