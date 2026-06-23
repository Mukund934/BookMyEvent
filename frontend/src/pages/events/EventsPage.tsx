import { useEffect, useState } from "react";

import EventCard from "../../components/EventCard";

import eventService from "../../services/event.service";

import type { Event } from "../../types/event.types";

import Layout from "../../components/Layout";

const EventsPage = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response =
					await eventService.getEvents();

				setEvents(
					response.data.events
				);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (loading) {
	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="flex justify-center">
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] px-8 py-5">
						<p className="text-zinc-400">
							Loading events...
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}

	return (
        <Layout>
		<div className="min-h-screen bg-[#09090B] text-white">
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="mb-14">

	<span className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
		Event Marketplace
	</span>

	<h1 className="text-5xl font-bold tracking-tight text-white">
		Explore Events
	</h1>

	<p className="mt-4 max-w-2xl text-lg text-zinc-400">
		Discover upcoming experiences, reserve seats instantly,
		and manage all your bookings from one place.
	</p>

</div>
<div className="mb-8 flex items-center justify-between">

	<p className="text-sm text-zinc-500">
		{events.length} Events Available
	</p>

</div>
				{events.length === 0 ? (
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-10 text-center">
						<div className="rounded-2xl border border-dashed border-zinc-700 bg-[#111113] p-12 text-center">

	<div className="mb-4 text-4xl">
		🎭
	</div>

	<h2 className="text-xl font-semibold text-white">
		No events available
	</h2>

	<p className="mt-3 text-zinc-400">
		New events will appear here once organizers publish them.
	</p>

</div>
					</div>
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
		</div>
        </Layout>
	);
};

export default EventsPage;