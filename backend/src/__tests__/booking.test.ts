import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import mongoose from "mongoose";

import {
	resetDatabase,
	startDatabase,
	stopDatabase,
} from "./setup";

vi.mock("../config/redis", () => ({
	default: {
		get: async () => null,
		set: async () => undefined,
		setex: async () => undefined,
		del: async () => undefined,
		keys: async () => [],
		incr: async () => undefined,
	},
}));

import Booking from "../models/Booking";
import Event from "../models/Event";
import User from "../models/User";

import { bookEvent, cancelBooking } from "../controllers/booking.controller";
import { updateEvent } from "../controllers/event.controller";

interface TestResponse {
	statusCode: number;
	body: any;
	status(code: number): TestResponse;
	json(payload: any): TestResponse;
}

const invoke = (handler: any, req: any) => {
	let settle: (value: { res: TestResponse; error: any }) => void;

	const done = new Promise<{ res: TestResponse; error: any }>(
		(resolve) => {
			settle = resolve;
		},
	);

	const res: TestResponse = {
		statusCode: 0,
		body: undefined,
		status(code: number) {
			this.statusCode = code;

			return this;
		},
		json(payload: any) {
			this.body = payload;

			settle({ res, error: undefined });

			return this;
		},
	};

	handler(req, res, (error: any) => settle({ res, error }));

	return done;
};

const seedEvent = async (organizerId: string, seats: number) =>
	Event.create({
		title: "Concurrency Test Event",
		description: "An event used to exercise seat inventory",
		date: new Date("2027-01-01T18:00:00.000Z"),
		location: "Raipur",
		price: 100,
		totalSeats: seats,
		availableSeats: seats,
		organizer: organizerId,
	});

const seedUser = async (email: string) =>
	User.create({ name: "Tester", email, password: "hashed" });

beforeAll(startDatabase, 120000);
afterAll(stopDatabase);
beforeEach(resetDatabase);

describe("seat inventory", () => {
	it("decrements availableSeats and records the amount owed", async () => {
		const user = await seedUser("a@test.com");
		const event = await seedEvent(String(user._id), 10);

		const { res, error } = await invoke(bookEvent, {
			user: { userId: String(user._id), role: "user" },
			body: { eventId: String(event._id), seats: 3 },
		});

		expect(error).toBeUndefined();
		expect(res.statusCode).toBe(201);

		const updated = await Event.findById(event._id);
		expect(updated!.availableSeats).toBe(7);

		const booking = await Booking.findOne({ user: user._id });
		expect(booking!.seatsBooked).toBe(3);
		expect(booking!.totalAmount).toBe(300);
		expect(booking!.reference).toMatch(/^BME-[A-Z2-9]{8}$/);
	});

	it("refuses to oversell when more seats are requested than remain", async () => {
		const user = await seedUser("b@test.com");
		const event = await seedEvent(String(user._id), 2);

		const { error } = await invoke(bookEvent, {
			user: { userId: String(user._id), role: "user" },
			body: { eventId: String(event._id), seats: 5 },
		});

		expect(error?.statusCode).toBe(400);

		const unchanged = await Event.findById(event._id);
		expect(unchanged!.availableSeats).toBe(2);
		expect(await Booking.countDocuments()).toBe(0);
	});

	it("never oversells when many users book the last seats at once", async () => {
		const organizer = await seedUser("organizer@test.com");
		const event = await seedEvent(String(organizer._id), 5);

		const users = await Promise.all(
			Array.from({ length: 12 }, (_, i) =>
				seedUser(`racer${i}@test.com`),
			),
		);

		const results = await Promise.all(
			users.map((user) =>
				invoke(bookEvent, {
					user: { userId: String(user._id), role: "user" },
					body: { eventId: String(event._id), seats: 1 },
				}).catch(() => ({ res: { statusCode: 0 }, error: "threw" })),
			),
		);

		const confirmed = results.filter(
			(result: any) => result.res.statusCode === 201,
		).length;

		const finalEvent = await Event.findById(event._id);
		const persisted = await Booking.countDocuments({ status: "active" });

		expect(finalEvent!.availableSeats).toBeGreaterThanOrEqual(0);
		expect(confirmed).toBeLessThanOrEqual(5);
		expect(persisted).toBe(confirmed);
		expect(finalEvent!.availableSeats).toBe(5 - confirmed);
	});
});

describe("duplicate bookings", () => {
	it("rejects a second active booking for the same event", async () => {
		const user = await seedUser("dup@test.com");
		const event = await seedEvent(String(user._id), 10);
		const req = {
			user: { userId: String(user._id), role: "user" },
			body: { eventId: String(event._id), seats: 1 },
		};

		const first = await invoke(bookEvent, req);
		expect(first.res.statusCode).toBe(201);

		const second = await invoke(bookEvent, { ...req }).catch(() => ({
			error: { statusCode: 409 },
		}));

		expect((second as any).error).toBeTruthy();

		expect(await Booking.countDocuments({ status: "active" })).toBe(1);

		const updated = await Event.findById(event._id);
		expect(updated!.availableSeats).toBe(9);
	});
});

describe("cancellation", () => {
	it("restores seats and marks the booking cancelled", async () => {
		const user = await seedUser("cancel@test.com");
		const event = await seedEvent(String(user._id), 10);

		await invoke(bookEvent, {
			user: { userId: String(user._id), role: "user" },
			body: { eventId: String(event._id), seats: 4 },
		});

		const booking = await Booking.findOne({ user: user._id });

		const { res } = await invoke(cancelBooking, {
			user: { userId: String(user._id), role: "user" },
			params: { bookingId: String(booking!._id) },
		});

		expect(res.statusCode).toBe(200);

		const restored = await Event.findById(event._id);
		expect(restored!.availableSeats).toBe(10);
		expect((await Booking.findById(booking!._id))!.status).toBe(
			"cancelled",
		);
	});

	it("refuses to cancel a booking owned by someone else", async () => {
		const owner = await seedUser("owner@test.com");
		const other = await seedUser("other@test.com");
		const event = await seedEvent(String(owner._id), 10);

		await invoke(bookEvent, {
			user: { userId: String(owner._id), role: "user" },
			body: { eventId: String(event._id), seats: 2 },
		});

		const booking = await Booking.findOne({ user: owner._id });

		const { error } = await invoke(cancelBooking, {
			user: { userId: String(other._id), role: "user" },
			params: { bookingId: String(booking!._id) },
		});

		expect(error?.statusCode).toBe(403);
		expect((await Booking.findById(booking!._id))!.status).toBe("active");
		expect((await Event.findById(event._id))!.availableSeats).toBe(8);
	});

	it("refuses to cancel twice so seats cannot be restored again", async () => {
		const user = await seedUser("twice@test.com");
		const event = await seedEvent(String(user._id), 10);

		await invoke(bookEvent, {
			user: { userId: String(user._id), role: "user" },
			body: { eventId: String(event._id), seats: 3 },
		});

		const booking = await Booking.findOne({ user: user._id });
		const req = {
			user: { userId: String(user._id), role: "user" },
			params: { bookingId: String(booking!._id) },
		};

		await invoke(cancelBooking, req);
		const { error } = await invoke(cancelBooking, req);

		expect(error?.statusCode).toBe(400);
		expect((await Event.findById(event._id))!.availableSeats).toBe(10);
	});
});

describe("event capacity edits", () => {
	it("refuses a capacity below the seats already sold", async () => {
		const organizer = await seedUser("cap@test.com");
		const attendee = await seedUser("attendee@test.com");
		const event = await seedEvent(String(organizer._id), 10);

		await invoke(bookEvent, {
			user: { userId: String(attendee._id), role: "user" },
			body: { eventId: String(event._id), seats: 6 },
		});

		const { error } = await invoke(updateEvent, {
			user: { userId: String(organizer._id), role: "user" },
			params: { id: String(event._id) },
			body: { totalSeats: 4 },
		});

		expect(error?.statusCode).toBe(400);
		expect((await Event.findById(event._id))!.totalSeats).toBe(10);
	});

	it("recalculates availability from seats sold when capacity grows", async () => {
		const organizer = await seedUser("grow@test.com");
		const attendee = await seedUser("grower@test.com");
		const event = await seedEvent(String(organizer._id), 10);

		await invoke(bookEvent, {
			user: { userId: String(attendee._id), role: "user" },
			body: { eventId: String(event._id), seats: 6 },
		});

		const { res } = await invoke(updateEvent, {
			user: { userId: String(organizer._id), role: "user" },
			params: { id: String(event._id) },
			body: { totalSeats: 20 },
		});

		expect(res.statusCode).toBe(200);

		const updated = await Event.findById(event._id);
		expect(updated!.totalSeats).toBe(20);
		expect(updated!.availableSeats).toBe(14);
	});

	it("refuses an edit from a user who does not own the event", async () => {
		const organizer = await seedUser("real@test.com");
		const stranger = await seedUser("stranger@test.com");
		const event = await seedEvent(String(organizer._id), 10);

		const { error } = await invoke(updateEvent, {
			user: { userId: String(stranger._id), role: "user" },
			params: { id: String(event._id) },
			body: { title: "Hijacked" },
		});

		expect(error?.statusCode).toBe(403);
		expect((await Event.findById(event._id))!.title).toBe(
			"Concurrency Test Event",
		);
	});
});

afterAll(async () => {
	if (mongoose.connection.readyState) {
		await mongoose.connection.close();
	}
});
