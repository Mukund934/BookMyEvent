import { Link } from "react-router-dom";

import ContentPage, { Section } from "../../components/ContentPage";

const HelpCenterPage = () => {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Help Center"
			intro="Short answers to the questions that come up most often."
		>
			<Section title="Account">
				<p>
					<span className="text-zinc-300">
						I forgot my password.
					</span>{" "}
					Use{" "}
					<Link
						to="/forgot-password"
						className="text-violet-400 hover:text-violet-300"
					>
						Forgot Password
					</Link>
					. If the address is registered you will receive a reset
					link, and it expires after thirty minutes. The same
					confirmation appears whether or not the address exists, so
					the page cannot be used to discover who has an account.
				</p>

				<p>
					<span className="text-zinc-300">
						Can I change my email or delete my account?
					</span>{" "}
					Not yet. Both are on the roadmap; today an account is
					created at registration and identified by that address.
				</p>

				<p>
					<span className="text-zinc-300">
						How long do I stay signed in?
					</span>{" "}
					Seven days, after which you are returned to the sign in page
					automatically.
				</p>
			</Section>

			<Section title="Bookings">
				<p>
					<span className="text-zinc-300">
						How do I cancel a booking?
					</span>{" "}
					Open{" "}
					<Link
						to="/bookings"
						className="text-violet-400 hover:text-violet-300"
					>
						My Bookings
					</Link>
					, choose Cancel Booking and confirm. Seats return to the
					event immediately.
				</p>

				<p>
					<span className="text-zinc-300">
						Is there a refund?
					</span>{" "}
					This project does not process payments, so no money changes
					hands and there is nothing to refund. Prices are shown for
					demonstration only.
				</p>

				<p>
					<span className="text-zinc-300">
						Where is my ticket?
					</span>{" "}
					Every booking has a View Ticket link with a QR code and your
					booking reference. The page is built to print or save as a
					PDF.
				</p>

				<p>
					<span className="text-zinc-300">
						Why can I only book an event once?
					</span>{" "}
					One booking per event per account keeps inventory
					predictable. Choose the seat count you need in a single
					booking.
				</p>
			</Section>

			<Section title="Events">
				<p>
					<span className="text-zinc-300">
						Who can publish an event?
					</span>{" "}
					Any signed in account. There is no separate organizer
					application step.
				</p>

				<p>
					<span className="text-zinc-300">
						Can I edit an event after publishing?
					</span>{" "}
					Yes, from the event page when you are its organizer. Every
					field can change; capacity cannot fall below the seats
					already sold.
				</p>

				<p>
					<span className="text-zinc-300">
						Why can I not delete my event?
					</span>{" "}
					Events with active bookings are protected so attendees do
					not lose a reservation without warning.
				</p>
			</Section>

			<Section title="Organizers">
				<p>
					<span className="text-zinc-300">
						What do the dashboard numbers mean?
					</span>{" "}
					Revenue is the total value of active bookings across your
					events. Cancellation rate is cancelled bookings as a share
					of all bookings, so it accounts for cancelled ones too.
				</p>

				<p>
					<span className="text-zinc-300">
						My numbers look out of date.
					</span>{" "}
					Analytics are cached for a few minutes and invalidated
					whenever one of your events is booked, cancelled or edited.
				</p>
			</Section>

			<Section title="Still stuck?">
				<p>
					Head to{" "}
					<Link
						to="/support"
						className="text-violet-400 hover:text-violet-300"
					>
						Support
					</Link>{" "}
					and we will pick it up from there.
				</p>
			</Section>
		</ContentPage>
	);
};

export default HelpCenterPage;
