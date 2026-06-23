import { Link } from "react-router-dom";
import type { Event } from "../types/event.types";

interface Props {
	event: Event;
}

const EventCard = ({ event }: Props) => {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6 transition duration-300 hover:-translate-y-1 hover:border-zinc-700">
			<div className="mb-4 flex items-center justify-between">
				<span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
					Event
				</span>

				<span className="text-sm text-zinc-500">
					₹{event.price}
				</span>
			</div>

			<h3 className="mb-3 text-xl font-semibold text-white">
				{event.title}
			</h3>

			<p className="mb-5 line-clamp-3 text-sm text-zinc-400">
				{event.description}
			</p>

			<div className="mb-5 space-y-2 text-sm text-zinc-400">
				<p>
					📍 {event.location}
				</p>

				<p>
					📅{" "}
					{new Date(
						event.date
					).toLocaleDateString()}
				</p>

				<p>
					🎟 {event.availableSeats} seats left
				</p>
			</div>

			<Link
				to={`/events/${event._id}`}
				className="block rounded-xl bg-violet-600 py-3 text-center text-sm font-medium text-white transition hover:bg-violet-500"
			>
				View Details
			</Link>
		</div>
	);
};

export default EventCard;