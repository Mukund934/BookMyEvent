import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth.middleware";

export const createEvent = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		const { title, description, date, location, price, totalSeats } =
			req.body;

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

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const skip = (page - 1) * limit;

		const location = req.query.location as string;
		const date = req.query.date as string;

		const filter: any = {};

		if (location) {
			filter.location = { $regex: location, $options: "i" };
		}

		if (date) {
			filter.date = new Date(date);
		}

		const events = await Event.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		const total = await Event.countDocuments(filter);

		res.status(200).json({
			success: true,
			page,
			totalPages: Math.ceil(total / limit),
			totalEvents: total,
			events,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		if (!id || typeof id !== "string") {
			res.status(400).json({
				success: false,
				message: "Invalid event ID",
			});
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({
				success: false,
				message: "Invalid event ID format",
			});
			return;
		}

		const event = await Event.findById(id).populate("organizer", "name email");

		if (!event) {
			res.status(404).json({
				success: false,
				message: "Event not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			event,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};