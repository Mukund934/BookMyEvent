import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Skeleton from "../../components/Skeleton";
import Card from "../../components/Card";
import BarChart from "../../components/BarChart";
import TrendChart from "../../components/TrendChart";

import dashboardService from "../../services/dashboard.service";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
import type { DashboardOverview } from "../../types/dashboard.types";

const DashboardPage = () => {
	const [data, setData] = useState<DashboardOverview | null>(null);

	const [loading, setLoading] = useState(true);

	const [failed, setFailed] = useState(false);

	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		let active = true;

		const fetchDashboard = async () => {
			try {
				const response = await dashboardService.getOverview();

				if (!active) return;

				setData(response.data);

				setFailed(false);
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

		fetchDashboard();

		return () => {
			active = false;
		};
	}, [reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
	};

	if (loading) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-10">
					<Skeleton className="h-12 w-64" />

					<div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						{[0, 1, 2, 3].map((placeholder) => (
							<Skeleton
								key={placeholder}
								className="h-32 rounded-2xl"
							/>
						))}
					</div>
				</div>
			</Layout>
		);
	}

	if (failed) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-10">
					<ErrorState
						title="Could not load your dashboard"
						description="Your analytics are temporarily unavailable. Check your connection and try again."
						onRetry={handleRetry}
					/>
				</div>
			</Layout>
		);
	}

	if (!data) {
		return (
			<Layout>
				<div className="mx-auto max-w-7xl px-6 py-10">
					<EmptyState
						icon="📊"
						title="No dashboard data yet"
						description="Publish your first event to start tracking revenue, bookings and performance."
						action={
							<Link
								to="/dashboard/create"
								className="inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								Create Event
							</Link>
						}
					/>
				</div>
			</Layout>
		);
	}

	const MONTHS = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	];

	const trendPoints = data.monthlyTrends.map((entry) => ({
		label: `${MONTHS[entry._id.month - 1]}`,
		value: entry.totalBookings,
		detail: `${MONTHS[entry._id.month - 1]} ${entry._id.year}: ${
			entry.totalBookings
		} booking${entry.totalBookings === 1 ? "" : "s"}, ${formatCurrency(
			entry.revenue,
		)}`,
	}));

	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-10">
				<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
							Dashboard
						</h1>

						<p className="mt-3 text-zinc-400">
							Monitor revenue, bookings and event performance from
							one centralized workspace.
						</p>
					</div>

					<Link
						to="/dashboard/create"
						className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
					>
						+ Create Event
					</Link>
				</div>

				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{[
						{
							label: "Total Revenue",
							value: formatCurrency(data.totalRevenue),
							hint: "Revenue generated",
							tone: "text-green-300",
						},
						{
							label: "Total Bookings",
							value: data.totalBookings,
							hint: "Booking activity",
							tone: "text-violet-300",
						},
						{
							label: "Cancelled",
							value: data.cancelledBookings,
							hint: "Cancelled reservations",
							tone: "text-red-300",
						},
						{
							label: "Cancellation Rate",
							value: `${data.cancellationRate}%`,
							hint: "Share of bookings cancelled",
							tone: "text-zinc-500",
						},
					].map((stat) => (
						<Card key={stat.label} interactive className="p-6">
							<p className="text-sm text-zinc-500">
								{stat.label}
							</p>

							<h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
								{stat.value}
							</h2>

							<p className={`mt-3 text-xs ${stat.tone}`}>
								{stat.hint}
							</p>
						</Card>
					))}
				</div>

				<Card className="mt-10 p-6">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2">
						<h2 className="text-2xl font-bold text-white">
							Booking Trend
						</h2>

						<span className="text-sm text-zinc-500">
							Bookings per month
						</span>
					</div>

					{trendPoints.length === 0 ? (
						<p className="py-10 text-center text-zinc-500">
							Booking activity will appear here once your events start
							selling.
						</p>
					) : (
						<TrendChart points={trendPoints} />
					)}
				</Card>

				<Card className="mt-10 p-6">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-2">
						<h2 className="text-2xl font-bold text-white">
							Top Events
						</h2>

						<span className="text-sm text-zinc-500">
							By revenue
						</span>
					</div>

					{data.topEvents.length === 0 ? (
						<EmptyState
							icon="📈"
							title="No analytics available yet"
							description="Publish your first event and booking insights will appear here."
							action={
								<Link
									to="/dashboard/create"
									className="inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
								>
									Create Event
								</Link>
							}
						/>
					) : (
						<BarChart
							format={formatCurrency}
							bars={data.topEvents.map((event) => ({
								label: event.title,
								value: event.revenue,
								caption: `${event.bookings} booking${
									event.bookings === 1 ? "" : "s"
								}`,
							}))}
						/>
					)}
				</Card>
			</div>
		</Layout>
	);
};

export default DashboardPage;
