import { Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";

import redis from "../config/redis";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { getCacheVersion } from "../utils/cacheVersion";

import Event from "../models/Event";

const getOrganizerMatch = (userId: string) => ({
	"event.organizer": new mongoose.Types.ObjectId(userId),
});

const organizerPipeline = (userId: string) => [
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

const basePipeline = (userId: string) => [
	{ $match: { status: "active" } },
	...organizerPipeline(userId),
];

export const getTopEventsByRevenue = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) throw new ApiError(401, "Unauthorized");

		const version = await getCacheVersion(
			`dashboard:${req.user.userId}`,
		);

		const cacheKey = `dashboard:topEvents:${req.user.userId}:${version}`;

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

		const version = await getCacheVersion(
			`dashboard:${req.user.userId}`,
		);

		const cacheKey = `dashboard:trends:${req.user.userId}:${version}`;

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

		const version = await getCacheVersion(
			`dashboard:${req.user.userId}`,
		);

		const cacheKey = `dashboard:cancellations:${req.user.userId}:${version}`;

		const cached = await redis.get(cacheKey);
		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const stats = await Booking.aggregate([
			...organizerPipeline(req.user.userId),
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

		const version = await getCacheVersion(
			`dashboard:${req.user.userId}`,
		);

		const cacheKey = `dashboard:heatmap:${req.user.userId}:${version}`;

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


export const getDashboardOverview = asyncHandler(
	async (req: AuthRequest, res: Response) => {
		if (!req.user) {
			throw new ApiError(401, "Unauthorized");
		}

		const version = await getCacheVersion(
			`dashboard:${req.user.userId}`,
		);

		const cacheKey = `dashboard:overview:${req.user.userId}:${version}`;

		const cached = await redis.get(cacheKey);

		if (cached) {
			return res.status(200).json({
				success: true,
				source: "cache",
				data: JSON.parse(cached),
			});
		}

		const organizerId = new mongoose.Types.ObjectId(
			req.user.userId,
		);

		const [topEvents, monthlyTrends, organizerEvents] =
			await Promise.all([
				Booking.aggregate([
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
				]),
				Booking.aggregate([
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
					{
						$sort: {
							"_id.year": 1,
							"_id.month": 1,
						},
					},
				]),
				Event.find({
					organizer: organizerId,
				}).select("_id"),
			]);

		const eventIds = organizerEvents.map(
			(event) => event._id,
		);

		const [totalBookings, cancelledBookings, revenueResult] =
			await Promise.all([
				Booking.countDocuments({
					event: { $in: eventIds },
				}),
				Booking.countDocuments({
					event: { $in: eventIds },
					status: "cancelled",
				}),
				Booking.aggregate([
					{
						$match: {
							event: { $in: eventIds },
							status: "active",
						},
					},
					{
						$group: {
							_id: null,
							totalRevenue: {
								$sum: "$totalAmount",
							},
						},
					},
				]),
			]);

		const totalRevenue =
			revenueResult[0]?.totalRevenue || 0;

		const cancellationRate =
			totalBookings > 0
				? Number(
						(
							(cancelledBookings /
								totalBookings) *
							100
						).toFixed(2),
				  )
				: 0;

		const responseData = {
			totalRevenue,
			totalBookings,
			cancelledBookings,
			cancellationRate,
			topEvents,
			monthlyTrends,
		};

		await redis.set(
			cacheKey,
			JSON.stringify(responseData),
			"EX",
			300,
		);

		res.status(200).json({
			success: true,
			source: "db",
			data: responseData,
		});
	},
);

export default {
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
	getDashboardOverview,
};
