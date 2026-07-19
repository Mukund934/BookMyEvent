import ContentPage, { Section } from "../../components/ContentPage";

const CookiesPage = () => {
	return (
		<ContentPage
			eyebrow="Legal"
			title="Cookie Policy"
			intro="The short version: this application does not use cookies at all. Here is what it uses instead, and why that distinction matters."
			updated="19 July 2026"
		>
			<Section title="No cookies are set">
				<p>
					BookMyEvent sets no cookies of its own. There is no consent
					banner because there is nothing to consent to: no analytics
					cookies, no advertising cookies, no third party trackers and
					no cross site identifiers.
				</p>
			</Section>

			<Section title="What is used instead">
				<p>
					Your session is kept in your browser's local storage under
					two keys. <span className="font-mono text-zinc-300">bookmyevent_token</span>{" "}
					holds the JSON Web Token that authenticates your requests,
					and{" "}
					<span className="font-mono text-zinc-300">bookmyevent_user</span>{" "}
					holds your name, email and role so the interface can greet
					you without an extra request.
				</p>

				<p>
					Local storage differs from cookies in one way that matters
					here: it is never attached automatically to outgoing
					requests. The token is added deliberately by the application
					on calls to its own API, and is not transmitted anywhere
					else.
				</p>
			</Section>

			<Section title="Clearing it">
				<p>
					Signing out removes both keys. Clearing site data in your
					browser has the same effect. Neither affects your account or
					your bookings, which live on the server; you will simply be
					asked to sign in again.
				</p>
			</Section>

			<Section title="If cookies are added later">
				<p>
					Moving the session into an httpOnly cookie would be a
					sensible hardening step for a production deployment, since a
					cookie marked httpOnly cannot be read by scripts. If that
					change is ever made, this page will be updated to describe
					the cookie, its lifetime and its purpose.
				</p>
			</Section>
		</ContentPage>
	);
};

export default CookiesPage;
