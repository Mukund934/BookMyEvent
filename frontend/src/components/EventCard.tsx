import { Link } from "react-router-dom";
import { formatDate, formatPrice } from "../utils/format";
import type { Event } from "../types/event.types";

import Card from "./Card";

interface Props {
	event: Event;
}

const EventCard = ({ event }: Props) => {
	return (
		<Card interactive className="flex flex-col overflow-hidden">
			{event.imageUrl ? (
				<img
					src={event.imageUrl}
					alt=""
					loading="lazy"
					className="h-40 w-full object-cover"
				/>
			) : (
				<div
					aria-hidden="true"
					className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-violet-950/50 via-[#15151a] to-[#09090B] text-4xl"
				>
					🎪
				</div>
			)}

			<div className="flex flex-1 flex-col p-6">
				<div className="mb-4 flex items-center justify-between">
					<span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
						{event.category || "Event"}
					</span>

					<span className="text-sm font-medium text-violet-400">
						{formatPrice(event.price)}
					</span>
				</div>

				<h3 className="mb-3 text-xl font-semibold text-white">
					{event.title}
				</h3>

				<p className="mb-5 line-clamp-3 text-sm text-zinc-400">
					{event.description}
				</p>

				<div className="mb-5 mt-auto space-y-2 text-sm text-zinc-400">
					<p>
						📍 {event.location}
					</p>

					<p>
						📅{" "}
						{formatDate(event.date)}
					</p>

					<p>
						🎟 {event.availableSeats} seats left
					</p>
				</div>

				<Link
					to={`/events/${event._id}`}
					className="block rounded-xl bg-violet-600 py-3 text-center text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
				>
					View Details
				</Link>
			</div>
		</Card>
	);
};

export default EventCard;
