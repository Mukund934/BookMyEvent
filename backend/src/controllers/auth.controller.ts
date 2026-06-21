import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const register = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			throw new ApiError(400, "All fields are required");
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new ApiError(400, "Email already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	},
);

export const login = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new ApiError(400, "Email and password are required");
		}

		const user = await User.findOne({ email });

		if (!user) {
			throw new ApiError(401, "Invalid credentials");
		}

		const isPasswordMatch = await bcrypt.compare(
			password,
			user.password,
		);

		if (!isPasswordMatch) {
			throw new ApiError(401, "Invalid credentials");
		}

		const token = jwt.sign(
			{
				userId: user._id,
				role: user.role,
			},
			process.env.JWT_SECRET as string,
			{
				expiresIn: "7d",
			},
		);

		res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	},
);