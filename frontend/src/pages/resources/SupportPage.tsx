import { Link } from "react-router-dom";

import ContentPage, { Section } from "../../components/ContentPage";

const SupportPage = () => {
	return (
		<ContentPage
			eyebrow="Resources"
			title="Support"
			intro="BookMyEvent is a portfolio project maintained by one developer. Here is the quickest way to reach a person."
		>
			<Section title="Before you write in">
				<p>
					Most questions are already answered in the{" "}
					<Link
						to="/help"
						className="text-violet-400 hover:text-violet-300"
					>
						Help Center
					</Link>
					, and the{" "}
					<Link
						to="/documentation"
						className="text-violet-400 hover:text-violet-300"
					>
						Documentation
					</Link>{" "}
					covers booking, publishing and managing inventory in more
					depth.
				</p>
			</Section>

			<Section title="Contact">
				<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
					<p className="text-sm text-zinc-500">Email</p>

					<a
						href="mailto:mukund.th04@gmail.com"
						className="mt-1 block text-lg text-violet-400 hover:text-violet-300"
					>
						mukund.th04@gmail.com
					</a>

					<p className="mt-5 text-sm text-zinc-500">
						Typical response time
					</p>

					<p className="mt-1 text-zinc-300">
						Within a few days. This is a side project rather than a
						staffed service, so there is no guaranteed response
						window.
					</p>
				</div>
			</Section>

			<Section title="Reporting a bug">
				<p>
					Bug reports are genuinely welcome. Including the following
					makes them much faster to act on:
				</p>

				<ul className="ml-5 list-disc space-y-2">
					<li>What you were trying to do</li>
					<li>What happened instead</li>
					<li>The page URL and your booking reference, if relevant</li>
					<li>Your browser and whether you were on mobile or desktop</li>
				</ul>
			</Section>

			<Section title="Security">
				<p>
					If you believe you have found a security issue, please
					report it by email rather than opening a public issue, and
					allow time for a fix before sharing it publicly.
				</p>
			</Section>

			<Section title="Source code">
				<p>
					BookMyEvent is open source. The repository, including its
					full commit history and engineering notes, is at{" "}
					<a
						href="https://github.com/Mukund934/BookMyEvent"
						target="_blank"
						rel="noreferrer"
						className="text-violet-400 hover:text-violet-300"
					>
						github.com/Mukund934/BookMyEvent
					</a>
					.
				</p>
			</Section>
		</ContentPage>
	);
};

export default SupportPage;
