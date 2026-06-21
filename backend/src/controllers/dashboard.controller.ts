import { Request, Response } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import { AuthRequest } from "../middleware/auth.middleware";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const getTopEventsByRevenue = asyncHandler(async (req: AuthRequest, res: Response) => {

	if (!req.user) {
		throw new ApiError(401, "Unauthorized");
	}

	const stats = await Booking.aggregate([
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
});

export const getMonthlyBookingTrends = asyncHandler(async (req: AuthRequest, res: Response) => {

	if (!req.user) {
		throw new ApiError(401, "Unauthorized");
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
});


export const getCancellationStats = asyncHandler(async (req: AuthRequest, res: Response) => {

	if (!req.user) {
		throw new ApiError(401, "Unauthorized");
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
});

export const getLocationHeatmap = asyncHandler(async (req: AuthRequest, res: Response) => {

	if (!req.user) {
		throw new ApiError(401, "Unauthorized");
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
});


export default {
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
};