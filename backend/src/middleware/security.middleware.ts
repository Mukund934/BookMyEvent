import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

export const securityMiddleware = [
	helmet(),

	mongoSanitize(),

	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
		message: {
			success: false,
			message: "Too many requests. Please try again later.",
		},
		standardHeaders: true,
		legacyHeaders: false,
	}),
];