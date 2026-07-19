import { Link } from "react-router-dom";

import ContentPage, { Section } from "../../components/ContentPage";

const DocumentationPage = () => {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Documentation"
			intro="Everything you need to browse events, book seats and run your own events on BookMyEvent."
		>
			<Section title="Getting started">
				<p>
					Browsing events needs no account. Open{" "}
					<Link
						to="/events"
						className="text-violet-400 hover:text-violet-300"
					>
						Explore Events
					</Link>{" "}
					to see everything currently published, filter by category,
					sort by date or price, and open any event for full details
					and live seat availability.
				</p>

				<p>
					You need an account to reserve seats, manage bookings or
					publish your own events. Registration asks only for a name,
					an email address and a password of at least eight
					characters.
				</p>
			</Section>

			<Section title="Booking seats">
				<p>
					Open an event and use the stepper in the booking panel to
					choose how many seats you want. The stepper stops at the
					number of seats still available, and the total updates as
					you go. Sold out events say so on the button rather than
					letting you start a booking that cannot succeed.
				</p>

				<p>
					Seat inventory is decremented atomically inside a database
					transaction, so two people booking the last seat at the same
					moment cannot both succeed. One booking per event per
					account is allowed; booking the same event twice returns a
					conflict rather than creating a duplicate.
				</p>
			</Section>

			<Section title="Your bookings and tickets">
				<p>
					Every confirmed booking gets a reference such as{" "}
					<span className="font-mono text-zinc-300">BME-ADJ68ECK</span>
					. Open a booking from{" "}
					<Link
						to="/bookings"
						className="text-violet-400 hover:text-violet-300"
					>
						My Bookings
					</Link>{" "}
					and choose View Ticket to see the reference as a QR code.
					The ticket page is designed to print, so you can save it as
					a PDF or bring a paper copy.
				</p>

				<p>
					Cancelling asks for confirmation first, then returns the
					seats to the event immediately. A cancelled booking keeps
					its ticket page but is clearly marked as cancelled so it
					cannot be mistaken for a valid one.
				</p>
			</Section>

			<Section title="Publishing an event">
				<p>
					Any signed in account can publish events. From the{" "}
					<Link
						to="/dashboard"
						className="text-violet-400 hover:text-violet-300"
					>
						Dashboard
					</Link>
					, choose Create Event and provide a title, description,
					date and time, location, category, price and seat count. A
					cover image URL is optional; events without one get a
					generated placeholder.
				</p>

				<p>
					Published events appear in the public listing straight
					away. Pricing is displayed only, since this project does not
					process payments.
				</p>
			</Section>

			<Section title="Managing inventory">
				<p>
					Open one of your events and choose Edit Event to change any
					detail. Seat capacity can be raised at any time. It can only
					be lowered as far as the number of seats already sold, so an
					edit can never invalidate a booking somebody is holding.
				</p>

				<p>
					Events can be deleted while they have no active bookings.
					Once a seat has been reserved the event is protected, and
					you will need to work through the bookings before removing
					it.
				</p>
			</Section>

			<Section title="Organizer analytics">
				<p>
					The dashboard reports revenue, total bookings, cancellations
					and cancellation rate across every event you own, along with
					your best performing events. Figures are cached briefly and
					refresh automatically when a booking is made or cancelled.
				</p>
			</Section>

			<Section title="Troubleshooting">
				<p>
					<span className="text-zinc-300">
						The site says my session expired.
					</span>{" "}
					Access tokens last seven days. Sign in again to continue;
					your bookings are unaffected.
				</p>

				<p>
					<span className="text-zinc-300">
						An event will not load.
					</span>{" "}
					The API is hosted on a free tier that sleeps when idle, so
					the first request after a quiet period can take up to a
					minute. Screens that fail offer a retry rather than
					pretending there is no data.
				</p>

				<p>
					<span className="text-zinc-300">
						I cannot reduce my event capacity.
					</span>{" "}
					Capacity cannot drop below the number of seats already
					booked. Cancel or work through those bookings first.
				</p>
			</Section>
		</ContentPage>
	);
};

export default DocumentationPage;
