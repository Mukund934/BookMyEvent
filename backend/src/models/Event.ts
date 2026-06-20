import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		venue: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		},
		totalSeats: {
			type: Number,
			required: true
		},
		availableSeats: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model("Event", eventSchema);