import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		totalSeats: {
			type: Number,
			required: true,
		},
		availableSeats: {
			type: Number,
			required: true,
		},
		organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

eventSchema.index({ organizer: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdAt: -1 });

export default mongoose.model("Event", eventSchema);