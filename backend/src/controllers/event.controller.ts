import { Response } from "express";

import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const {
			title,
			description,
			date,
			location,
			price,
			totalSeats,
		} = req.body;

		if (
			!title ||
			!description ||
			!date ||
			!location ||
			!price ||
			!totalSeats
		) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		if (!req.user) {
			res.status(401).json({
				message: "Unauthorized",
			});
			return;
		}

		const event = await Event.create({
			title,
			description,
			date,
			location,
			price,
			totalSeats,
			availableSeats: totalSeats,
			organizer: req.user.userId,
		});

		res.status(201).json({
			message: "Event created successfully",
			event,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};