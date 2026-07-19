import ContentPage, { Section } from "../../components/ContentPage";

const TermsPage = () => {
	return (
		<ContentPage
			eyebrow="Legal"
			title="Terms of Service"
			intro="Plain terms for using a demonstration project. Nothing here creates a commercial relationship."
			updated="19 July 2026"
		>
			<Section title="Nature of the service">
				<p>
					BookMyEvent is a portfolio project provided as is, without
					warranty, uptime commitment or support obligation. It runs
					on free hosting tiers, may be unavailable without notice,
					and its data may be reset at any time.
				</p>

				<p>
					Bookings made here are not tickets to real events and confer
					no entitlement to attend anything.
				</p>
			</Section>

			<Section title="Your account">
				<p>
					You are responsible for the accuracy of what you enter and
					for keeping your password to yourself. Use an address you
					control, and do not reuse a password from anywhere else.
				</p>
			</Section>

			<Section title="Publishing events">
				<p>
					Any signed in account may publish events. If you publish
					one, keep its details accurate and its capacity honest. You
					may edit an event at any time, though capacity cannot fall
					below the seats already booked, and you may delete it once
					it has no active bookings.
				</p>
			</Section>

			<Section title="Booking and cancellation">
				<p>
					Seats are allocated on a first come basis and confirmed
					only once inventory has been decremented. One booking per
					event per account. You may cancel at any time, which
					returns the seats to the event immediately.
				</p>

				<p>
					As no payment is taken, cancellation involves no charge and
					no refund.
				</p>
			</Section>

			<Section title="Acceptable use">
				<p>
					Do not publish unlawful, misleading or offensive content,
					impersonate anyone, attempt to access another account, or
					place automated load on the service beyond ordinary use.
				</p>

				<p>
					Security research is welcome if you report findings
					privately and do not degrade the service for others.
				</p>
			</Section>

			<Section title="Termination">
				<p>
					Accounts or content that breach these terms may be removed
					without notice. You may stop using the service at any time.
				</p>
			</Section>

			<Section title="Liability">
				<p>
					The project is offered without warranty of any kind. To the
					extent permitted by law, the author is not liable for any
					loss arising from its use, including data loss or
					unavailability.
				</p>
			</Section>

			<Section title="Changes">
				<p>
					These terms may change as the project develops. The date
					above reflects the most recent revision.
				</p>
			</Section>
		</ContentPage>
	);
};

export default TermsPage;
