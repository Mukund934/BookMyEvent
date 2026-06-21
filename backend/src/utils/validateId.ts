import mongoose from "mongoose";

export const validateObjectId = (id: unknown): string | null => {
	if (!id) return null;

	if (Array.isArray(id)) return null;

	if (typeof id !== "string") return null;

	if (!mongoose.Types.ObjectId.isValid(id)) return null;

	return id;
};