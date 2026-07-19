import Event from "../models/Event";
import Booking from "../models/Booking";
import { generateBookingReference } from "../utils/bookingReference";

export const runMigrations = async (): Promise<void> => {
	try {
		const backfilled = await Event.updateMany(
			{ category: { $exists: false } },
			{ $set: { category: "Other" } },
		);

		if (backfilled.modifiedCount > 0) {
			console.log(
				`Backfilled category on ${backfilled.modifiedCount} event(s)`,
			);
		}

		const withoutReference = await Booking.find({
			reference: { $exists: false },
		}).select("_id");

		for (const booking of withoutReference) {
			await Booking.updateOne(
				{ _id: booking._id },
				{ $set: { reference: generateBookingReference() } },
			);
		}

		if (withoutReference.length > 0) {
			console.log(
				`Backfilled reference on ${withoutReference.length} booking(s)`,
			);
		}
	} catch (error) {
		console.error("Migration error:", error);
	}
};
