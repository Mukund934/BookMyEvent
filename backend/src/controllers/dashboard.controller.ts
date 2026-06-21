import { Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";

import redis from "../config/redis";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const getOrganizerMatch = (userId: string) => ({
	"event.organizer": new mongoose.Types.ObjectId(userId),
});

const basePipeline = (userId: string) => [
	{ $match: { status: "active" } },
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
		$match: getOrganizerMatch(userId),
	},
];

export const getTopEventsByRevenue = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new ApiError(401, "Unauthorized");

		const cacheKey = `dashboard:topEvents:${req.user.userId}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const stats = await Booking.aggregate([
			...basePipeline(req.user.userId),
			{
				$group: {
					_id: "$event._id",
					title: { $first: "$event.title" },
					revenue: { $sum: "$totalAmount" },
					bookings: { $sum: 1 },
				},
			},
			{ $sort: { revenue: -1 } },
			{ $limit: 5 },
		]);

		await redis.set(cacheKey, JSON.stringify(stats), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: stats,
		});
	},
);

export const getMonthlyBookingTrends = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new ApiError(401, "Unauthorized");

		const cacheKey = `dashboard:trends:${req.user.userId}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const trends = await Booking.aggregate([
			...basePipeline(req.user.userId),
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

		await redis.set(cacheKey, JSON.stringify(trends), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: trends,
		});
	},
);

export const getCancellationStats = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new ApiError(401, "Unauthorized");

		const cacheKey = `dashboard:cancellations:${req.user.userId}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const stats = await Booking.aggregate([
			...basePipeline(req.user.userId),
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		await redis.set(cacheKey, JSON.stringify(stats), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: stats,
		});
	},
);

export const getLocationHeatmap = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new ApiError(401, "Unauthorized");

		const cacheKey = `dashboard:heatmap:${req.user.userId}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const heatmap = await Booking.aggregate([
			...basePipeline(req.user.userId),
			{
				$group: {
					_id: "$event.location",
					bookings: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { bookings: -1 } },
		]);

		await redis.set(cacheKey, JSON.stringify(heatmap), "EX", 300);

		res.status(200).json({
			success: true,
			source: "db",
			data: heatmap,
		});
	},
);

export default {
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
};
