import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error(
		`[${req.method} ${req.originalUrl}] ${err?.name}: ${err?.message}`,
	);

	if (process.env.NODE_ENV !== "production") {
		console.error(err?.stack);
	}

	let error = err;

	if (!(error instanceof ApiError)) {
		if (err?.name === "ValidationError") {
			error = new ApiError(400, "Invalid request data");
		} else if (err?.name === "CastError") {
			error = new ApiError(400, "Invalid identifier");
		} else if (err?.code === 11000) {
			error = new ApiError(409, "Resource already exists");
		} else {
			error = new ApiError(500, "Internal Server Error");
		}
	}

	res.status(error.statusCode).json({
		success: false,
		message: error.message,
		errors: error.errors || [],
	});
};

export default errorMiddleware;