import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		seatsBooked: {
			type: Number,
			required: true,
			min: 1,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "cancelled"],
			default: "active",
		},
	},
	{
		timestamps: true,
	},
);

bookingSchema.index({ user: 1, event: 1 });
export default mongoose.model("Booking", bookingSchema);
