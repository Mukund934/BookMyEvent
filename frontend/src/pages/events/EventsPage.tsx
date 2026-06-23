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
			<div className="min-h-screen bg-[#09090B] text-white">
				<div className="mx-auto max-w-7xl px-6 py-20">
					<p className="text-zinc-400">
						Loading events...
					</p>
				</div>
			</div>
		);
	}

	return (
        <Layout>
		<div className="min-h-screen bg-[#09090B] text-white">
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="mb-12">
					<h1 className="text-4xl font-bold tracking-tight text-white">
						Explore Events
					</h1>

					<p className="mt-3 text-zinc-400">
						Discover upcoming events
						and reserve your seats.
					</p>
				</div>

				{events.length === 0 ? (
					<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-10 text-center">
						<p className="text-zinc-400">
							No events found.
						</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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