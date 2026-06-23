import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import bookingService from "../../services/booking.service";

import type { Booking } from "../../types/booking.types";
import { toast } from "sonner";

const MyBookingsPage = () => {
	const [bookings, setBookings] = useState<Booking[]>([]);

	const [loading, setLoading] = useState(true);

	const handleCancelBooking = async (bookingId: string) => {
		try {
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
					<p className="text-zinc-400">Loading bookings...</p>
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
						Manage your event reservations.
					</p>
				</div>

				{bookings.length === 0 ? (
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-10 text-center">
						<p className="text-zinc-400">No bookings found.</p>
					</div>
				) : (
					<div className="space-y-6">
						{bookings.map((booking) => (
							<div
								key={booking._id}
								className="rounded-2xl border border-zinc-800 bg-[#111113] p-6 transition hover:border-zinc-700"
							>
								<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
									<div>
										<h2 className="text-xl font-semibold text-white">
											{booking.event.title}
										</h2>

										<p className="mt-2 text-zinc-400">
											📍 {booking.event.location}
										</p>

										<p className="mt-1 text-zinc-400">
											📅{" "}
											{new Date(
												booking.event.date,
											).toLocaleDateString()}
										</p>
									</div>

									<div className="flex flex-wrap gap-10">
										<div>
											<p className="text-sm text-zinc-500">
												Seats
											</p>

											<p className="font-medium text-white">
												{booking.seatsBooked}
											</p>
										</div>

										<div>
											<p className="text-sm text-zinc-500">
												Amount
											</p>

											<p className="font-medium text-white">
												₹{booking.totalAmount}
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

											{booking.status === "active" && (
												<button
													onClick={() =>
														handleCancelBooking(
															booking._id,
														)
													}
													className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500"
												>
													Cancel Booking
												</button>
											)}
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
