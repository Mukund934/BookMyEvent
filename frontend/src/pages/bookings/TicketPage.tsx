import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import QRCode from "qrcode";

import Layout from "../../components/Layout";
import Button from "../../components/Button";
import ErrorState from "../../components/ErrorState";
import Skeleton from "../../components/Skeleton";

import bookingService from "../../services/booking.service";

import type { Booking } from "../../types/booking.types";

import { formatCurrency, formatDateTime } from "../../utils/format";

const TicketPage = () => {
	const { id } = useParams();

	const [booking, setBooking] = useState<Booking | null>(null);
	const [qr, setQr] = useState("");
	const [loading, setLoading] = useState(true);
	const [failed, setFailed] = useState(false);
	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		let active = true;

		const fetchTicket = async () => {
			try {
				const response = await bookingService.getMyBookings();

				if (!active) return;

				const match =
					response.bookings.find(
						(item) => item._id === id,
					) || null;

				setBooking(match);

				setFailed(false);

				if (match) {
					const dataUrl = await QRCode.toDataURL(
						match.reference || match._id,
						{
							width: 320,
							margin: 1,
							color: {
								dark: "#09090B",
								light: "#FFFFFF",
							},
						},
					);

					if (active) {
						setQr(dataUrl);
					}
				}
			} catch (error) {
				console.error(error);

				if (active) {
					setFailed(true);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		fetchTicket();

		return () => {
			active = false;
		};
	}, [id, reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
	};

	if (loading) {
		return (
			<Layout>
				<div className="mx-auto max-w-xl px-6 py-14">
					<Skeleton className="h-[560px] rounded-2xl" />
				</div>
			</Layout>
		);
	}

	if (failed || !booking) {
		return (
			<Layout>
				<div className="mx-auto max-w-xl px-6 py-14">
					<ErrorState
						title="Ticket unavailable"
						description="We could not load this ticket. It may belong to another account, or the connection failed."
						onRetry={handleRetry}
					/>
				</div>
			</Layout>
		);
	}

	const cancelled = booking.status === "cancelled";

	return (
		<Layout>
			<div className="mx-auto max-w-xl px-6 py-14 print:py-0">
				<div className="mb-6 flex items-center justify-between print:hidden">
					<Link
						to="/bookings"
						className="text-sm text-violet-400 transition-colors duration-200 hover:text-violet-300"
					>
						← Back to bookings
					</Link>

					<Button onClick={() => window.print()}>
						Print or Save as PDF
					</Button>
				</div>

				<div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] print:border-zinc-400 print:bg-white">
					<div className="border-b border-dashed border-zinc-800 bg-gradient-to-br from-violet-950/40 to-[#09090B] p-8 text-center print:border-zinc-400 print:bg-white">
						<p className="text-xs uppercase tracking-[0.2em] text-violet-400 print:text-zinc-600">
							BookMyEvent Ticket
						</p>

						<h1 className="mt-3 text-2xl font-bold tracking-tight text-white print:text-black">
							{booking.event.title}
						</h1>

						<p className="mt-2 text-sm text-zinc-400 print:text-zinc-700">
							{formatDateTime(booking.event.date)} ·{" "}
							{booking.event.location}
						</p>

						{cancelled && (
							<p
								role="status"
								className="mt-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400"
							>
								This booking was cancelled
							</p>
						)}
					</div>

					<div className="flex flex-col items-center gap-5 p-8">
						{qr && (
							<img
								src={qr}
								alt={`QR code for booking ${booking.reference}`}
								className="h-52 w-52 rounded-xl bg-white p-3"
							/>
						)}

						<div className="text-center">
							<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
								Booking Reference
							</p>

							<p className="mt-2 font-mono text-2xl font-bold tracking-wider text-white print:text-black">
								{booking.reference || booking._id}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-px border-t border-dashed border-zinc-800 bg-zinc-800 print:border-zinc-400 print:bg-zinc-300">
						<div className="bg-[#111113] p-6 print:bg-white">
							<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
								Seats
							</p>

							<p className="mt-2 text-lg font-semibold text-white print:text-black">
								{booking.seatsBooked}
							</p>
						</div>

						<div className="bg-[#111113] p-6 print:bg-white">
							<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
								Total Paid
							</p>

							<p className="mt-2 text-lg font-semibold text-white print:text-black">
								{formatCurrency(booking.totalAmount)}
							</p>
						</div>
					</div>
				</div>

				<p className="mt-6 text-center text-xs text-zinc-500 print:text-zinc-600">
					Present this reference at the venue entrance.
				</p>
			</div>
		</Layout>
	);
};

export default TicketPage;
