import { Request, Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";
import redis from "../config/redis";

export const getTopEventsByRevenue = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const stats = await Booking.aggregate([
			{
				$match: { status: "active" },
			},
			{
				$lookup: {
					from: "events",
					localField: "event",
					foreignField: "_id",
					as: "event",
				},
			},
			{ $unwind: "$event" },
			{
				$match: {
					"event.organizer": new mongoose.Types.ObjectId(req.user.userId),
				},
			},
			{
				$group: {
					_id: "$event._id",
					title: { $first: "$event.title" },
					revenue: { $sum: "$totalAmount" },
					bookings: { $sum: 1 },
				},
			},
			{ $sort: { revenue: -1 } },
		]);

		res.status(200).json({
			success: true,
			data: stats,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getMonthlyBookingTrends = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const trends = await Booking.aggregate([
			{
				$lookup: {
					from: "events",
					localField: "event",
					foreignField: "_id",
					as: "event",
				},
			},
			{ $unwind: "$event" },
			{
				$match: {
					"event.organizer": new mongoose.Types.ObjectId(req.user.userId),
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
					},
					totalBookings: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { "_id.year": 1, "_id.month": 1 } },
		]);

		res.status(200).json({
			success: true,
			data: trends,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};



export const getCancellationStats = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const stats = await Booking.aggregate([
			{
				$lookup: {
					from: "events",
					localField: "event",
					foreignField: "_id",
					as: "event",
				},
			},
			{ $unwind: "$event" },
			{
				$match: {
					"event.organizer": new mongoose.Types.ObjectId(req.user.userId),
				},
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: stats,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};



export const getLocationHeatmap = async (
	req: AuthRequest,
	res: Response,
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const heatmap = await Booking.aggregate([
			{
				$lookup: {
					from: "events",
					localField: "event",
					foreignField: "_id",
					as: "event",
				},
			},
			{ $unwind: "$event" },
			{
				$match: {
					"event.organizer": new mongoose.Types.ObjectId(req.user.userId),
				},
			},
			{
				$group: {
					_id: "$event.location",
					bookings: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { bookings: -1 } },
		]);

		res.status(200).json({
			success: true,
			data: heatmap,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};



export default {
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
};