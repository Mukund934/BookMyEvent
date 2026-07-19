import { Request, Response } from "express";
import crypto from "crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { sendPasswordResetEmail } from "../utils/mailer";

const DUMMY_PASSWORD_HASH = bcrypt.hashSync("bookmyevent", 10);

export const register = asyncHandler(
	async (req: Request, res: Response) => {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			throw new ApiError(400, "All fields are required");
		}

		if (String(password).length < 8) {
			throw new ApiError(
				400,
				"Password must be at least 8 characters",
			);
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
			await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

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
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const hashResetToken = (token: string) =>
	crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = asyncHandler(
	async (req: Request, res: Response) => {
		const { email } = req.body;

		if (!email) {
			throw new ApiError(400, "Email is required");
		}

		const user = await User.findOne({ email });

		if (user) {
			const token = crypto.randomBytes(32).toString("hex");

			user.resetPasswordToken = hashResetToken(token);
			user.resetPasswordExpires = new Date(
				Date.now() + RESET_TOKEN_TTL_MS,
			);

			await user.save();

			const clientUrl =
				process.env.CLIENT_URL || "http://localhost:5173";

			await sendPasswordResetEmail({
				to: user.email,
				resetUrl: `${clientUrl}/reset-password?token=${token}`,
			});
		}

		res.status(200).json({
			success: true,
			message:
				"If an account exists for that email, a reset link has been sent",
		});
	},
);

export const resetPassword = asyncHandler(
	async (req: Request, res: Response) => {
		const { token, password } = req.body;

		if (!token || !password) {
			throw new ApiError(400, "Token and password are required");
		}

		if (String(password).length < 8) {
			throw new ApiError(
				400,
				"Password must be at least 8 characters",
			);
		}

		const user = await User.findOne({
			resetPasswordToken: hashResetToken(String(token)),
			resetPasswordExpires: { $gt: new Date() },
		}).select("+resetPasswordToken +resetPasswordExpires");

		if (!user) {
			throw new ApiError(400, "Reset link is invalid or has expired");
		}

		user.password = await bcrypt.hash(password, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	},
);
