import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import eventService from "../../services/event.service";

import type { Event } from "../../types/event.types";
import Layout from "../../components/Layout";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import bookingService from "../../services/booking.service";

const EventDetailsPage = () => {
	const { id } = useParams();

	const [event, setEvent] = useState<Event | null>(null);

	const [loading, setLoading] = useState(true);

	const [tickets, setTickets] = useState(1);

	const navigate = useNavigate();

	const [bookingLoading, setBookingLoading] = useState(false);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				if (!id) return;

				const response = await eventService.getEventById(id);

				setEvent(response.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvent();
	}, [id]);

	const handleBooking = async () => {
		try {
			const token = localStorage.getItem("bookmyevent_token");

			if (!token) {
				toast.error("Please login to book seats");

				navigate("/login");

				return;
			}

			if (!event) return;

			setBookingLoading(true);

			const response = await bookingService.createBooking({
				eventId: event._id,
				seats: tickets,
			});

			toast.success(response.message || "Booking successful");

			navigate("/bookings");
		} catch (error: any) {
			toast.error(error?.response?.data?.message || "Booking failed");
		} finally {
			setBookingLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#09090B] text-white">
				<div className="mx-auto max-w-7xl px-6 py-20">
					<p className="text-zinc-400">Loading event...</p>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-20">
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-10 text-center">
						<h2 className="mb-3 text-2xl font-bold">
							Event Not Found
						</h2>

						<p className="mb-6 text-zinc-400">
							The event you are looking for does not exist.
						</p>

						<Link
							to="/events"
							className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
						>
							Browse Events
						</Link>
					</div>
				</div>
			</Layout>
		);
	}

	const totalPrice = event.price * tickets;

	return (
		<Layout>
			<div className="min-h-screen bg-[#09090B] text-white">
				<div className="h-[320px] border-b border-zinc-800 bg-gradient-to-br from-violet-950/40 via-[#111113] to-[#09090B]">
					<div className="mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
						<div>
							<Link
								to="/events"
								className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
							>
								← Back to Events
							</Link>

							<span className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
								Event
							</span>

							<h1 className="max-w-4xl text-5xl font-bold tracking-tight">
								{event.title}
							</h1>

							<p className="mt-4 max-w-2xl text-lg text-zinc-400">
								{event.description}
							</p>

							<div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-400">
								<span>📍 {event.location}</span>

								<span>
									📅{" "}
									{new Date(event.date).toLocaleDateString()}
								</span>

								<span>
									🎟 {event.availableSeats} seats left
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto max-w-7xl px-6 py-16">
					<div className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
						<div className="space-y-8">
							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
								<h2 className="mb-5 text-2xl font-bold">
									Event Overview
								</h2>

								<p className="leading-relaxed text-zinc-400">
									{event.description}
								</p>
							</div>

							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
								<h2 className="mb-5 text-2xl font-bold">
									Event Information
								</h2>

								<div className="grid gap-5 md:grid-cols-2">
									<div>
										<p className="mb-1 text-sm text-zinc-500">
											Date
										</p>

										<p className="font-medium">
											{new Date(
												event.date,
											).toLocaleDateString()}
										</p>
									</div>

									<div>
										<p className="mb-1 text-sm text-zinc-500">
											Location
										</p>

										<p className="font-medium">
											{event.location}
										</p>
									</div>

									<div>
										<p className="mb-1 text-sm text-zinc-500">
											Total Seats
										</p>

										<p className="font-medium">
											{event.totalSeats}
										</p>
									</div>

									<div>
										<p className="mb-1 text-sm text-zinc-500">
											Available Seats
										</p>

										<p className="font-medium">
											{event.availableSeats}
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
								<h2 className="mb-5 text-2xl font-bold">
									Organizer
								</h2>

								<div className="flex items-center gap-4">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-lg font-bold">
										O
									</div>

									<div>
										<h3 className="font-semibold">
											Event Organizer
										</h3>

										<p className="text-sm text-zinc-400">
											Verified Event Organizer
										</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<div className="sticky top-24 rounded-2xl border border-zinc-800 bg-[#111113] p-6">
								<div className="mb-6">
									<p className="text-sm text-zinc-500">
										Starting From
									</p>

									<h2 className="text-4xl font-bold">
										₹{event.price}
									</h2>
								</div>

								<div className="mb-6 rounded-xl border border-zinc-800 p-4">
									<p className="mb-3 text-sm text-zinc-400">
										Tickets
									</p>

									<div className="flex items-center justify-between">
										<button
											onClick={() =>
												setTickets(
													Math.max(1, tickets - 1),
												)
											}
											className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700"
										>
											-
										</button>

										<span className="text-lg font-semibold">
											{tickets}
										</span>

										<button
											onClick={() =>
												setTickets(tickets + 1)
											}
											className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700"
										>
											+
										</button>
									</div>
								</div>

								<div className="mb-6 space-y-3 border-t border-zinc-800 pt-6">
									<div className="flex justify-between text-zinc-400">
										<span>Price</span>

										<span>₹{event.price}</span>
									</div>

									<div className="flex justify-between text-zinc-400">
										<span>Quantity</span>

										<span>{tickets}</span>
									</div>

									<div className="flex justify-between border-t border-zinc-800 pt-3 text-lg font-semibold">
										<span>Total</span>

										<span>₹{totalPrice}</span>
									</div>
								</div>

								<button
									onClick={handleBooking}
									disabled={bookingLoading}
									className="w-full rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{bookingLoading
										? "Booking..."
										: "Book Seats"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default EventDetailsPage;
