import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<Navbar />

			<main className="relative overflow-hidden">

                <div className="absolute inset-0 -z-10">
	<div
		className="
			absolute
			left-0
			top-20
			h-72
			w-72
			rounded-full
			bg-violet-600/10
			blur-3xl
		"
	/>

	<div
		className="
			absolute
			right-0
			top-40
			h-72
			w-72
			rounded-full
			bg-violet-500/10
			blur-3xl
		"
	/>
</div>
				<section className="relative overflow-hidden py-28">

	<div className="absolute inset-0">

		{/* Grid */}
		<div
			className="
				absolute
				inset-0
				bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)]
				bg-[size:48px_48px]
				opacity-30
			"
		/>

		{/* Hero Glow */}
		<div
			className="
				absolute
				inset-0
				bg-[radial-gradient(circle_at_center,rgba(125,73,247,0.22),transparent_65%)]
			"
		/>

		{/* Fade Into Black */}
		<div
			className="
				absolute
				inset-0
				bg-gradient-to-b
				from-transparent
				via-transparent
				to-[#09090B]
			"
		/>

	</div>

	<div className="relative z-10 mx-auto max-w-7xl px-6">

						<div className="max-w-3xl">
							<span className="
mb-4
inline-flex
rounded-full
border
border-violet-500/30
bg-violet-500/10
px-4
py-2
text-sm
text-violet-400
transition-all
duration-200
hover:border-violet-500/50
">
								Modern Event Management Platform
							</span>

							<h1 className="mb-6 text-6xl font-bold tracking-tight md:text-7xl leading-[0.95]">
								Discover Events.
								<br />
								Book Instantly.
								<br />
								<span className="text-violet-500">
									Experience More.
								</span>
							</h1>

							<p className="max-w-xl text-lg leading-relaxed text-zinc-400">
								BookMyEvent helps users discover events, reserve
								seats, track bookings, and manage experiences
								from one modern platform.
							</p>

							<div className="mt-10 flex flex-wrap gap-4">
								<Link
									to="/events"
									className="
rounded-xl
bg-violet-600
px-7
py-3.5
font-medium
text-white
transition-all
duration-200
hover:bg-violet-500
hover:shadow-lg
hover:shadow-violet-500/20
"
								>
									Explore Events
								</Link>

								<Link
									to="/register"
									className="rounded-xl border border-zinc-700 px-7 py-3.5 font-medium text-zinc-300 transition-all duration-200 hover:border-violet-500/20 hover:bg-[#111113] hover:text-white"
								>
									Create an Account
								</Link>
							</div>
						</div>
					</div>
				</section>






                

				<section className="py-20">
					<div className="mx-auto max-w-7xl px-6">
						<div className="grid gap-6 md:grid-cols-3">
							<div className="
group
rounded-2xl
border
border-zinc-800
bg-[#111113]
p-6
transition-all
duration-200
hover:-translate-y-1
hover:border-violet-500/20
hover:shadow-lg
hover:shadow-violet-500/5
">
								<h3 className="mb-2 text-lg font-semibold">
									Discover Events
								</h3>

								<p className="text-zinc-400">
									Browse upcoming events and find experiences
									you'll love.
								</p>
							</div>

							<div className="
group
rounded-2xl
border
border-zinc-800
bg-[#111113]
p-6
transition-all
duration-200
hover:-translate-y-1
hover:border-violet-500/20
hover:shadow-lg
hover:shadow-violet-500/5
">
								<h3 className="mb-2 text-lg font-semibold">
									Book Instantly
								</h3>

								<p className="text-zinc-400">
									Reserve seats with real-time availability
									and fast booking.
								</p>
							</div>

							<div className="
group
rounded-2xl
border
border-zinc-800
bg-[#111113]
p-6
transition-all
duration-200
hover:-translate-y-1
hover:border-violet-500/20
hover:shadow-lg
hover:shadow-violet-500/5
">
								<h3 className="mb-2 text-lg font-semibold">
									Manage Everything
								</h3>

								<p className="text-zinc-400">
									Track bookings and event performance in one
									place.
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
