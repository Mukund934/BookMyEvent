import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import eventService from "../../services/event.service";

import type { Event } from "../../types/event.types";
import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Skeleton from "../../components/Skeleton";
import Button from "../../components/Button";
import authService from "../../services/auth.service";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { formatCurrency, formatDateTime, formatPrice } from "../../utils/format";
import { getErrorMessage } from "../../utils/error";

import bookingService from "../../services/booking.service";

const EventDetailsPage = () => {
	const { id } = useParams();

	const [event, setEvent] = useState<Event | null>(null);

	const [loading, setLoading] = useState(true);

	const [tickets, setTickets] = useState(1);

	const navigate = useNavigate();

	const [bookingLoading, setBookingLoading] = useState(false);

	const [failed, setFailed] = useState(false);

	const [reloadToken, setReloadToken] = useState(0);

	const [confirmingDelete, setConfirmingDelete] = useState(false);

	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		let active = true;

		const fetchEvent = async () => {
			try {
				if (!id) return;

				setLoading(true);

				const response = await eventService.getEventById(id);

				if (!active) return;

				setEvent(response.data);

				setFailed(false);
			} catch (error) {
				console.error(error);

				if (active) {
					const status = (error as AxiosError)?.response
						?.status;

					setFailed(!status || status >= 500);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		fetchEvent();

		return () => {
			active = false;
		};
	}, [id, reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
	};

	const handleDelete = async () => {
		if (!event || deleting) return;

		try {
			setDeleting(true);

			await eventService.deleteEvent(event._id);

			toast.success("Event deleted successfully");

			navigate("/dashboard");
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Failed to delete event"),
			);
		} finally {
			setDeleting(false);

			setConfirmingDelete(false);
		}
	};

	const handleBooking = async () => {
		if (bookingLoading) return;

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
		} catch (error) {
			toast.error(getErrorMessage(error, "Booking failed"));
		} finally {
			setBookingLoading(false);
		}
	};

	if (loading) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
					<Skeleton className="h-64 rounded-2xl" />

					<div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
						<Skeleton className="h-96 rounded-2xl" />

						<Skeleton className="h-96 rounded-2xl" />
					</div>
				</div>
			</Layout>
		);
	}

	if (failed) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
					<ErrorState
						title="Could not load this event"
						description="The event details are temporarily unavailable. Check your connection and try again."
						onRetry={handleRetry}
					/>
				</div>
			</Layout>
		);
	}

	if (!event) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
					<EmptyState
						icon="🔍"
						title="Event not found"
						description="This event does not exist or is no longer published."
						action={
							<Link
								to="/events"
								className="inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								Browse Events
							</Link>
						}
					/>
				</div>
			</Layout>
		);
	}

	const organizer =
		typeof event.organizer === "string"
			? null
			: event.organizer;

	const organizerName = organizer?.name || "Event Organizer";

	const currentUser = authService.getUser();

	const isOrganizer = Boolean(
		organizer && currentUser && organizer._id === currentUser.id,
	);

	const organizerEmail = organizer?.email || "";

	const totalPrice = event.price * tickets;

	return (
		<Layout>
			<div className="min-h-screen bg-[#09090B] text-white">
				<div className="h-[320px] border-b border-zinc-800 bg-gradient-to-br from-violet-950/40 via-[#111113] to-[#09090B]">
					<div className="mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
						<div>
							<Link
								to="/events"
								className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400 transition hover:text-violet-200"
							>
								← Back to Events
							</Link>

							<h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
								{event.title}
							</h1>

							{isOrganizer && (
								<div className="mt-5 flex flex-wrap items-center gap-3">
									<Button
										variant="secondary"
										onClick={() =>
											navigate(
												`/dashboard/events/${event._id}/edit`,
											)
										}
									>
										Edit Event
									</Button>

									{confirmingDelete ? (
										<>
											<Button
												variant="danger"
												disabled={deleting}
												onClick={handleDelete}
											>
												{deleting
													? "Deleting..."
													: "Confirm Delete"}
											</Button>

											<Button
												variant="secondary"
												disabled={deleting}
												onClick={() =>
													setConfirmingDelete(false)
												}
											>
												Keep
											</Button>
										</>
									) : (
										<Button
											variant="danger"
											onClick={() =>
												setConfirmingDelete(true)
											}
										>
											Delete Event
										</Button>
									)}
								</div>
							)}

							<p className="mt-4 max-w-2xl text-lg text-zinc-400">
								{event.description}
							</p>

							<div className="mt-6 flex flex-wrap gap-3">
								<span className="rounded-full border border-zinc-800 bg-[#111113]/70 px-4 py-2 text-sm text-zinc-300">
									📍 {event.location}
								</span>

								<span className="rounded-full border border-zinc-800 bg-[#111113]/70 px-4 py-2 text-sm text-zinc-300">
									📅{" "}
									{formatDateTime(event.date)}
								</span>

								<span className={
	event.availableSeats < 10
		? "rounded-full border border-red-500/20 bg-red-500/3 px-3 py-1 text-red-400"
		: "rounded-full border border-green-500/20 bg-green-500/3 px-3 py-1 text-green-400"
}>
									🎟 {event.availableSeats} seats left
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mx-auto max-w-7xl px-6 py-16">
					<div className="grid gap-8 lg:grid-cols-[1.7fr_0.8fr]">
						<div className="space-y-8">
							<div
								className="
	group
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-8
	transition-all
	duration-200
	hover:border-violet-500/20
	hover:shadow-lg
	hover:shadow-violet-500/5
"
							>
								<h2 className="mb-5 text-2xl font-bold">
									Event Overview
								</h2>

								<p className="
	group
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-8
	transition-all
	duration-200
	hover:-translate-y-1
	hover:border-violet-500/20
	hover:shadow-lg
	hover:shadow-violet-500/5
">
									{event.description}
								</p>
							</div>

							<div
								className="
	group
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-8
	transition-all
	duration-200
	hover:border-violet-500/20
	hover:shadow-lg
	hover:shadow-violet-500/5
"
							>
								<h2 className="mb-5 text-2xl font-bold">
									Event Information
								</h2>

                                <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
	<h2 className="mb-5 text-2xl font-bold">
		Why Attend?
	</h2>

	<ul className="space-y-3 text-zinc-400">
		<li>✓ Secure online booking</li>
		<li>✓ Instant booking confirmation</li>
		<li>✓ Real-time seat availability</li>
		<li>✓ Easy cancellation management</li>
	</ul>
</div>

								<div className="grid gap-5 md:grid-cols-2">
									<div>
										<p className="mb-1 text-sm text-zinc-500">
											Date
										</p>

										<p className="font-medium">
											{formatDateTime(event.date)}
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

							<div
								className="
	group
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-8
	transition-all
	duration-200
	hover:border-violet-500/20
	hover:shadow-lg
	hover:shadow-violet-500/5
"
							>
								<h2 className="mb-5 text-2xl font-bold">
									Organizer
								</h2>

								<div className="flex items-center gap-4">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-lg font-bold">
										{organizerName.charAt(0).toUpperCase()}
									</div>

									<div>
										<h3 className="font-semibold">
											{organizerName}
										</h3>

										{organizerEmail && (
											<p className="text-sm text-zinc-400">
												{organizerEmail}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						<div>
							<div
								className="
		sticky
		top-24
		rounded-2xl
		border
		border-zinc-800
		bg-[#111113]
		p-6
		transition-all
		duration-200
		hover:border-violet-500/20
		hover:shadow-lg
		hover:shadow-violet-500/5
	"
							>
								<div className="mb-6">
									<p className="text-sm text-zinc-500">
										Starting From
									</p>

									<h2 className="text-4xl font-bold tracking-tight text-violet-400">
										{formatPrice(event.price)}
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
											disabled={tickets <= 1}
											aria-label="Decrease tickets"
											className="
	flex
	h-10
	w-10
	items-center
	justify-center
	rounded-xl
	border
	border-zinc-700
	transition-all
	duration-200
	hover:border-violet-500/30
	hover:bg-violet-500/10
	disabled:cursor-not-allowed
	disabled:opacity-40
"
										>
											-
										</button>

										<span className="text-lg font-semibold">
											{tickets}
										</span>

										<button
											onClick={() =>
												setTickets(
													Math.min(
														event.availableSeats,
														tickets + 1,
													),
												)
											}
											disabled={
												tickets >= event.availableSeats
											}
											aria-label="Increase tickets"
											className="
	flex
	h-10
	w-10
	items-center
	justify-center
	rounded-xl
	border
	border-zinc-700
	transition-all
	duration-200
	hover:border-violet-500/30
	hover:bg-violet-500/10
	disabled:cursor-not-allowed
	disabled:opacity-40
"
										>
											+
										</button>
									</div>
								</div>

								<div className="mb-6 space-y-3 border-t border-zinc-800 pt-6">
									<div className="flex justify-between text-zinc-400">
										<span>Price</span>

										<span>{formatPrice(event.price)}</span>
									</div>

									<div className="flex justify-between text-zinc-400">
										<span>Quantity</span>

										<span>{tickets}</span>
									</div>

									<div className="flex justify-between border-t border-zinc-800 pt-3 text-lg font-semibold">
										<span>Total</span>

										<span className="text-violet-400">
	{formatCurrency(totalPrice)}
</span>
									</div>
								</div>

								<button
									onClick={handleBooking}
									disabled={
										bookingLoading ||
										event.availableSeats < 1
									}
									className="
	w-full
	rounded-xl
	bg-violet-600
	py-3
	text-sm
	font-medium
	text-white
	transition-all
	duration-200
	hover:bg-violet-500
	hover:shadow-lg
	hover:shadow-violet-500/20
	disabled:cursor-not-allowed
	disabled:opacity-50
"
								>
									{event.availableSeats < 1
										? "Sold Out"
										: bookingLoading
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
