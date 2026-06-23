import { useEffect, useState } from "react";

import Layout from "../../components/Layout";

import dashboardService from "../../services/dashboard.service";
import { Link } from "react-router-dom";
import type { DashboardOverview } from "../../types/dashboard.types";

const DashboardPage = () => {
	const [data, setData] = useState<DashboardOverview | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				const response = await dashboardService.getOverview();

				setData(response.data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboard();
	}, []);

	if (loading) {
		return (
			<Layout>
				<div className="p-10 text-white">Loading dashboard...</div>
			</Layout>
		);
	}

	if (!data) {
		return (
			<Layout>
				<div className="p-10 text-white">No data found.</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-10">
				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-4xl font-bold text-white">Dashboard</h1>

					<Link
						to="/dashboard/create"
						className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
					>
						+ Create Event
					</Link>
				</div>

				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
						<p className="text-sm text-zinc-500">Total Revenue</p>

						<h2 className="mt-3 text-4xl font-bold text-white">
							₹{data.totalRevenue}
						</h2>
					</div>

					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
						<p className="text-sm text-zinc-500">Total Bookings</p>

						<h2 className="mt-3 text-4xl font-bold text-white">
							{data.totalBookings}
						</h2>
					</div>

					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
						<p className="text-sm text-zinc-500">Cancelled</p>

						<h2 className="mt-3 text-4xl font-bold text-white">
							{data.cancelledBookings}
						</h2>
					</div>

					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
						<p className="text-sm text-zinc-500">
							Cancellation Rate
						</p>

						<h2 className="mt-3 text-4xl font-bold text-white">
							{data.cancellationRate}%
						</h2>
					</div>
				</div>
				<div className="mt-10 rounded-2xl border border-zinc-800 bg-[#111113] p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold text-white">
							Top Events
						</h2>

						<span className="text-sm text-zinc-500">
							Best Performing Events
						</span>
					</div>

					{data.topEvents.length === 0 ? (
						<div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center">
							<p className="text-zinc-500">
								No event analytics available yet.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{data.topEvents.map((event) => (
								<div
									key={event._id}
									className="flex items-center justify-between rounded-xl border border-zinc-800 p-4"
								>
									<div>
										<h3 className="font-semibold text-white">
											{event.title}
										</h3>
									</div>

									<div className="text-right">
										<p className="font-semibold text-violet-400">
											₹{event.revenue}
										</p>

										<p className="text-sm text-zinc-500">
											Revenue
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
