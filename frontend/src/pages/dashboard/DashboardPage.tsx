import { useEffect, useState } from "react";

import Layout from "../../components/Layout";

import dashboardService from "../../services/dashboard.service";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/format";
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
				<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="text-5xl tracking-tight font-bold tracking-tight text-white">
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
					<div
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
						<p className="text-sm text-zinc-500">
		Total Revenue
	</p>

	<h2 className="mt-3 text-5xl font-bold tracking-tight text-white">
		{formatCurrency(data.totalRevenue)}
	</h2>

	<p className="mt-3 text-xs text-green-300">
		↑ Revenue generated 
	</p>
					</div>

					<div
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
						<p className="text-sm text-zinc-500">
							Total Bookings 🎟
						</p>

						<h2 className="mt-3 text-5xl tracking-tight font-bold text-white">
							{data.totalBookings}
						</h2>
                        <p className="mt-3 text-xs text-violet-300">
	↑ Booking activity
</p>
					</div>

					<div
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
						<p className="text-sm text-zinc-500">Cancelled ❌</p>

						<h2 className="mt-3 text-5xl tracking-tight font-bold text-white">
							{data.cancelledBookings}
						</h2>
                        <p className="mt-3 text-xs text-red-300">
	↓ Cancelled reservations
</p>
					</div>

					<div
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
						<p className="text-sm text-zinc-500">
							Cancellation Rate 📉
						</p>

						<h2 className="mt-3 text-5xl tracking-tight font-bold text-white">
							{data.cancellationRate}%
						</h2>
                        <p className="mt-3 text-xs text-zinc-500">
	Updated in real time
</p>
					</div>
				</div>
				<div className="mt-10 rounded-2xl border border-zinc-800 bg-[#111113] p-6 transition-all duration-200 hover:border-zinc-700 hover:-translate-y-1">
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
							<div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
								<div className="mb-4 text-4xl"></div>

								<h3 className="text-lg font-semibold text-white">
									No analytics available yet
								</h3>

								<p className="mt-3 text-zinc-400">
									Create your first event and start collecting
									booking insights.
								</p>

								<Link
									to="/dashboard/create"
									className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
								>
									+ Create Event
								</Link>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							{data.topEvents.map((event) => (
								<div
									key={event._id}
									className="
		flex
		items-center
		justify-between
		rounded-xl
		border
		border-zinc-800
		p-4
		transition-all
		duration-200
		hover:border-zinc-700
		hover:bg-zinc-900/40
        hover:border-violet-500/20

		hover:shadow-lg

		hover:shadow-violet-500/5
	"
								>
									<div>
										<h3 className="font-semibold text-white">
											{event.title}
										</h3>
									</div>

									<div className="text-right">
										<p className="font-semibold text-violet-400">
											{formatCurrency(event.revenue)}
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
