import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const stripOperators = (value: any): any => {
	if (Array.isArray(value)) {
		return value.map(stripOperators);
	}

	if (value && typeof value === "object") {
		const cleaned: Record<string, any> = {};

		for (const key of Object.keys(value)) {
			if (key.startsWith("$") || key.includes(".")) {
				continue;
			}

			cleaned[key] = stripOperators(value[key]);
		}

		return cleaned;
	}

	return value;
};

const sanitizeRequest = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	if (req.body && typeof req.body === "object") {
		req.body = stripOperators(req.body);
	}

	next();
};

export const securityMiddleware = [
	helmet(),

	sanitizeRequest,

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