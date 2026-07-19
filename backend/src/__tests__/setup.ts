import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

import Booking from "../models/Booking";
import Event from "../models/Event";
import User from "../models/User";

let replSet: MongoMemoryReplSet;

export const startDatabase = async () => {
	replSet = await MongoMemoryReplSet.create({
		replSet: { count: 1 },
	});

	await mongoose.connect(replSet.getUri());

	await Promise.all([
		User.createCollection(),
		Event.createCollection(),
		Booking.createCollection(),
	]);

	await Promise.all([
		User.syncIndexes(),
		Event.syncIndexes(),
		Booking.syncIndexes(),
	]);
};

export const stopDatabase = async () => {
	await mongoose.disconnect();

	await replSet.stop();
};

export const resetDatabase = async () => {
	await Promise.all([
		User.deleteMany({}),
		Event.deleteMany({}),
		Booking.deleteMany({}),
	]);
};
