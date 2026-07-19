import { useEffect, useState } from "react";

import EventCard from "../../components/EventCard";

import eventService from "../../services/event.service";

import type { Event } from "../../types/event.types";

import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Skeleton from "../../components/Skeleton";

const EventsPage = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [failed, setFailed] = useState(false);

	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const [totalPages, setTotalPages] = useState(1);
	const [totalEvents, setTotalEvents] = useState(0);

	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			const next = searchInput.trim();

			if (next === search) return;

			setSearch(next);

			setPage(1);

			setLoading(true);
		}, 350);

		return () => {
			clearTimeout(timer);
		};
	}, [searchInput, search]);

	useEffect(() => {
		let active = true;

		const fetchEvents = async () => {
			try {
				const response =
					await eventService.getEvents({
						page,
						search: search || undefined,
					});

				if (!active) return;

				setEvents(
					response.data.events
				);

				setTotalPages(
					response.data.pagination.totalPages
				);

				setTotalEvents(
					response.data.pagination.totalEvents
				);

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

		fetchEvents();

		return () => {
			active = false;
		};
	}, [page, search, reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
	};

	const changePage = (next: number) => {
		setLoading(true);

		setPage(next);

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
				<div className="mb-14">

	<span className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
		Event Marketplace
	</span>

	<h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
		Explore Events
	</h1>

	<p className="mt-4 max-w-2xl text-lg text-zinc-400">
		Discover upcoming experiences, reserve seats instantly,
		and manage all your bookings from one place.
	</p>

</div>

				<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<label
						htmlFor="event-search"
						className="sr-only"
					>
						Search events
					</label>

					<input
						id="event-search"
						type="search"
						value={searchInput}
						onChange={(e) =>
							setSearchInput(e.target.value)
						}
						placeholder="Search by title or location"
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition-all duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 md:max-w-sm"
					/>

					<p className="text-sm text-zinc-500">
						{loading
							? "Loading events"
							: failed
								? "Events unavailable"
								: `${totalEvents} Event${totalEvents !== 1 ? "s" : ""} Available`}
					</p>
				</div>

				{loading ? (
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[0, 1, 2, 3, 4, 5].map((placeholder) => (
							<Skeleton
								key={placeholder}
								className="h-64 rounded-2xl"
							/>
						))}
					</div>
				) : failed ? (
					<ErrorState
						title="Could not load events"
						description="The event list is temporarily unavailable. Check your connection and try again."
						onRetry={handleRetry}
					/>
				) : events.length === 0 ? (
					<EmptyState
						icon={search ? "🔍" : "🎭"}
						title={
							search
								? "No matching events"
								: "No events available"
						}
						description={
							search
								? `Nothing matched "${search}". Try a different title or location.`
								: "New events will appear here once organizers publish them."
						}
					/>
				) : (
					<>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{events.map((event) => (
								<EventCard
									key={event._id}
									event={event}
								/>
							))}
						</div>

						{totalPages > 1 && (
							<nav
								aria-label="Pagination"
								className="mt-12 flex items-center justify-center gap-4"
							>
								<button
									onClick={() => changePage(page - 1)}
									disabled={page <= 1}
									className="rounded-xl border border-zinc-800 bg-[#111113] px-5 py-3 text-sm text-zinc-300 transition-all duration-200 hover:border-violet-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
								>
									Previous
								</button>

								<span className="text-sm text-zinc-500">
									Page {page} of {totalPages}
								</span>

								<button
									onClick={() => changePage(page + 1)}
									disabled={page >= totalPages}
									className="rounded-xl border border-zinc-800 bg-[#111113] px-5 py-3 text-sm text-zinc-300 transition-all duration-200 hover:border-violet-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
								>
									Next
								</button>
							</nav>
						)}
					</>
				)}
			</div>
		</Layout>
	);
};

export default EventsPage;
