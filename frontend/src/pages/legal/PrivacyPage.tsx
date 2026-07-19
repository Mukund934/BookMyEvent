import ContentPage, { Section } from "../../components/ContentPage";

const PrivacyPage = () => {
	return (
		<ContentPage
			eyebrow="Legal"
			title="Privacy Policy"
			intro="BookMyEvent is a portfolio project rather than a commercial service. This page describes honestly what the application stores and why."
			updated="19 July 2026"
		>
			<Section title="What this project is">
				<p>
					BookMyEvent was built to demonstrate full stack engineering
					work. It is publicly reachable and anyone may create an
					account, but it is not operated as a business and carries no
					service guarantees. Please do not store anything sensitive
					in it.
				</p>
			</Section>

			<Section title="Information collected">
				<p>
					Creating an account stores your name, email address and a
					bcrypt hash of your password. The plain password is never
					written to the database or to logs.
				</p>

				<p>
					Using the application stores the events you publish and the
					bookings you make, including seat counts, amounts and
					booking references. That is the complete set of personal
					data held.
				</p>

				<p>
					No analytics service, advertising network, tracking pixel or
					third party script runs on this site.
				</p>
			</Section>

			<Section title="Authentication">
				<p>
					Signing in returns a JSON Web Token that identifies you for
					seven days. It is held in your browser's local storage and
					sent with each request. Signing out removes it from your
					browser.
				</p>

				<p>
					Because the token lives in local storage rather than an
					httpOnly cookie, it is readable by scripts running on the
					page. This is a deliberate simplification appropriate to a
					demonstration project and would be worth revisiting for a
					production deployment.
				</p>
			</Section>

			<Section title="Payments">
				<p>
					No payment is ever taken. Prices and revenue figures exist
					to make the booking and analytics flows realistic. No card
					details are requested, transmitted or stored anywhere in
					this application.
				</p>
			</Section>

			<Section title="Third party services">
				<p>
					The application runs on infrastructure operated by others:
					the interface is hosted on Vercel, the API on Render, the
					database on MongoDB Atlas and the cache on Upstash. Each
					processes data as part of hosting it, under their own
					policies.
				</p>
			</Section>

			<Section title="Security">
				<p>
					Passwords are hashed with bcrypt. Traffic is served over
					HTTPS. The API applies rate limiting, security headers,
					request sanitisation and per user authorisation checks, and
					password reset tokens are stored only as a hash with a
					thirty minute expiry.
				</p>

				<p>
					These are reasonable measures for a project of this size,
					not a claim of certification against any particular
					standard.
				</p>
			</Section>

			<Section title="Your data">
				<p>
					You can stop using the service at any time. Self service
					account deletion is not built yet; until it is, email the
					address on the Support page and the account and its bookings
					will be removed.
				</p>
			</Section>

			<Section title="Contact">
				<p>
					Questions about this page can go to the address listed on
					the Support page.
				</p>
			</Section>
		</ContentPage>
	);
};

export default PrivacyPage;
