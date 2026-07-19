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

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1, status: 1 });

bookingSchema.index(
	{ user: 1, event: 1 },
	{
		unique: true,
		partialFilterExpression: { status: "active" },
	},
);

export default mongoose.model("Booking", bookingSchema);
