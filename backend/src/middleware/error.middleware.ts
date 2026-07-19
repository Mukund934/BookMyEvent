import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	console.error("\n========== ERROR ==========");
	console.error("Message:", err?.message);
	console.error("Name:", err?.name);
	console.error("Stack:", err?.stack);
	console.error("Full Error:", err);
	console.error("===========================\n");

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