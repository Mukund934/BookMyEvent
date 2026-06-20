import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const protectedRoute = (
	req: AuthRequest,
	res: Response
): void => {
	res.status(200).json({
		message: "Protected route accessed successfully",
		user: req.user
	});
};