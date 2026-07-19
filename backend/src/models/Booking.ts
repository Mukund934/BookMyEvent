import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
	user: Types.ObjectId;
	event: Types.ObjectId;
	seatsBooked: number;
	totalAmount: number;
	status: "active" | "cancelled";
	createdAt: Date;
	updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event: {
			type: Schema.Types.ObjectId,
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

export default mongoose.model<IBooking>("Booking", bookingSchema);
