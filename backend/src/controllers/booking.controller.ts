import { Request, Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth.middleware";

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

		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			res.status(400).json({
				message: "Invalid event id",
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

		res.status(201).json({
			message: "Booking successful",
			booking,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
