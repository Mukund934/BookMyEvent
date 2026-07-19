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

	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		let active = true;

		const fetchEvents = async () => {
			try {
				const response =
					await eventService.getEvents();

				if (!active) return;

				setEvents(
					response.data.events
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
	}, [reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
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
<div className="mb-8 flex items-center justify-between">

	<p className="text-sm text-zinc-500">
		{loading
			? "Loading events"
			: failed
				? "Events unavailable"
				: `${events.length} Events Available`}
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
						icon="🎭"
						title="No events available"
						description="New events will appear here once organizers publish them."
					/>
				) : (
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{events.map((event) => (
							<EventCard
								key={event._id}
								event={event}
							/>
						))}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default EventsPage;
