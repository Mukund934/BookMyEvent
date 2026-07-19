import Event from "../models/Event";

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
	} catch (error) {
		console.error("Migration error:", error);
	}
};
