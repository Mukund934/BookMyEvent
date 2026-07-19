import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import bookingService from "../../services/booking.service";

import type { Booking } from "../../types/booking.types";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatCurrency, formatDateTime } from "../../utils/format";

const MyBookingsPage = () => {
	const [bookings, setBookings] = useState<Booking[]>([]);

	const [loading, setLoading] = useState(true);

	const [confirmingId, setConfirmingId] = useState<string | null>(null);

	const [cancellingId, setCancellingId] = useState<string | null>(null);

	const handleCancelBooking = async (bookingId: string) => {
		if (cancellingId) return;

		try {
			setCancellingId(bookingId);

			await bookingService.cancelBooking(bookingId);

			toast.success("Booking cancelled successfully");

			setBookings((prev) =>
				prev.map((booking) =>
					booking._id === bookingId
						? {
								...booking,
								status: "cancelled",
							}
						: booking,
				),
			);
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || "Cancellation failed",
			);
		} finally {
			setCancellingId(null);

			setConfirmingId(null);
		}
	};

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await bookingService.getMyBookings();

				setBookings(response.bookings);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	if (loading) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-20">
					<div className="flex items-center justify-center">
						<div className="rounded-xl border border-zinc-800 bg-[#111113] px-6 py-4">
							<p className="text-zinc-400">
								Loading your bookings...
							</p>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-white">
						My Bookings
					</h1>

					<p className="mt-3 text-zinc-400">
						View, manage and cancel your event reservations.
					</p>
					<p className="mt-4 text-sm text-zinc-500">
						{bookings.length} Booking
						{bookings.length !== 1 ? "s" : ""} Found
					</p>
				</div>

				{bookings.length === 0 ? (
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-12 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl">
							🎟️
						</div>

						<h2 className="text-xl font-semibold text-white">
							No bookings yet
						</h2>

						<p className="mt-3 text-zinc-400">
							Explore upcoming events and reserve your first seat.
						</p>

						<Link
							to="/events"
							className="
		mt-6
		inline-flex
		rounded-xl
		bg-violet-600
		px-5
		py-3
		text-sm
		font-medium
		text-white
		transition-all
		duration-200
		hover:bg-violet-500
		hover:shadow-lg
		hover:shadow-violet-500/20
	"
						>
							Browse Events
						</Link>
					</div>
				) : (
					<div className="space-y-6">
						{bookings.map((booking) => (
							<div
								key={booking._id}
								className="
	group
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-6
	transition-all
	duration-200
	hover:-translate-y-1
	hover:border-violet-500/20
	hover:shadow-lg
	hover:shadow-violet-500/5
"
							>
								<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
									<div>
										<h2 className="text-xl font-semibold tracking-tight text-white">
											{booking.event.title}
										</h2>

										<p className="mt-2 text-zinc-400">
											📍 {booking.event.location}
										</p>

										<p className="mt-1 text-zinc-400">
											📅{" "}
											{formatDateTime(booking.event.date)}
										</p>
									</div>

									<div className="flex flex-wrap gap-10">
										<div>
											<p className="text-sm text-zinc-500">
												Seats
											</p>

											<p className="text-lg font-semibold text-white">
												{booking.seatsBooked}
											</p>
										</div>

										<div>
											<p className="text-sm text-zinc-500">
												Amount
											</p>

											<p className="text-lg font-semibold text-violet-400">
												{formatCurrency(booking.totalAmount)}
											</p>
										</div>

										<div>
											<p className="text-sm text-zinc-500">
												Status
											</p>

											<p
												className={
													booking.status === "active"
														? "font-medium text-green-400"
														: "font-medium text-red-400"
												}
											>
												{booking.status}
											</p>

											{booking.status === "active" &&
												(confirmingId === booking._id ? (
													<div className="mt-3 flex items-center gap-2">
														<button
															onClick={() =>
																handleCancelBooking(
																	booking._id,
																)
															}
															disabled={
																cancellingId ===
																booking._id
															}
															className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
														>
															{cancellingId ===
															booking._id
																? "Cancelling..."
																: "Confirm"}
														</button>

														<button
															onClick={() =>
																setConfirmingId(
																	null,
																)
															}
															disabled={
																cancellingId ===
																booking._id
															}
															className="rounded-lg border border-zinc-800 bg-[#111113] px-4 py-2 text-sm text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
														>
															Keep
														</button>
													</div>
												) : (
													<button
														onClick={() =>
															setConfirmingId(
																booking._id,
															)
														}
														className="
	mt-3
	rounded-lg
	bg-red-600
	px-4
	py-2
	text-sm
	text-white
	transition-all
	duration-200
	hover:bg-red-500
	hover:shadow-lg
	hover:shadow-red-500/20
"
													>
														Cancel Booking
													</button>
												))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default MyBookingsPage;
