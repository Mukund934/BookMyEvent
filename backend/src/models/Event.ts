import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEvent extends Document {
	title: string;
	description: string;
	date: Date;
	location: string;
	category: string;
	imageUrl?: string;
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
		category: {
			type: String,
			enum: [
				"Music",
				"Sports",
				"Technology",
				"Business",
				"Arts",
				"Food",
				"Other",
			],
			default: "Other",
		},
		imageUrl: {
			type: String,
			default: "",
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
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdAt: -1 });

export default mongoose.model<IEvent>("Event", eventSchema);