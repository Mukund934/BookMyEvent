import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<Navbar />

			<main>
				<section className="py-24">
					<div className="mx-auto max-w-7xl px-6">
						<div className="max-w-3xl">
							<span className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
								Modern Event Management Platform
							</span>

							<h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
								Discover Events.
								<br />
								Book Instantly.
								<br />
								<span className="text-violet-500">
									Experience More.
								</span>
							</h1>

							<p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
								BookMyEvent helps users discover
								events, reserve seats, track
								bookings, and manage experiences
								from one modern platform.
							</p>

							<div className="mt-10 flex flex-wrap gap-4">
								<button className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500">
									Explore Events
								</button>

								<button className="rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white">
									View Demo
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className="py-20">
					<div className="mx-auto max-w-7xl px-6">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
								<h3 className="mb-2 text-lg font-semibold">
									Discover Events
								</h3>

								<p className="text-zinc-400">
									Browse upcoming events and
									find experiences you'll love.
								</p>
							</div>

							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
								<h3 className="mb-2 text-lg font-semibold">
									Book Instantly
								</h3>

								<p className="text-zinc-400">
									Reserve seats with real-time
									availability and fast booking.
								</p>
							</div>

							<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">
								<h3 className="mb-2 text-lg font-semibold">
									Manage Everything
								</h3>

								<p className="text-zinc-400">
									Track bookings and event
									performance in one place.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default LandingPage;