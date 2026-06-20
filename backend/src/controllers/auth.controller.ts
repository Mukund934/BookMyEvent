import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";

export const register = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({
				message: "All fields are required",
			});
			return;
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			res.status(400).json({
				message: "Email already exists",
			});
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		const userResponse = {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		res.status(201).json({
			message: "User registered successfully",
			user: userResponse,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
