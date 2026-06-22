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
		error = new ApiError(
			500,
			err?.message || "Internal Server Error",
		);
	}

	res.status(error.statusCode).json({
		success: false,
		message: error.message,
		errors: error.errors || [],
	});
};

export default errorMiddleware;