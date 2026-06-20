import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: {
		userId: string;
		role: string;
	};
}

export const protect = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				message: "Access denied",
			});
			return;
		}

		const token = authHeader.split(" ")[1];

		if (!token) {
			res.status(401).json({
				message: "Token missing",
			});
			return;
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as jwt.JwtPayload;

		req.user = {
			userId: decoded.userId as string,
			role: decoded.role as string,
		};

		next();
	} catch (error) {
		res.status(401).json({
			message: "Invalid token",
		});
	}
};
