import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEvent extends Document {
	title: string;
	description: string;
	date: Date;
	location: string;
	price: number;
	totalSeats: number;
	availableSeats: number;
	organizer: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
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
			type: Schema.Types.ObjectId,
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

export default mongoose.model<IEvent>("Event", eventSchema);