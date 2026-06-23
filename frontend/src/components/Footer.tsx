import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="border-t border-zinc-800 bg-[#09090B]">
			<div className="mx-auto max-w-7xl px-6 py-16">
				<div className="grid gap-12 md:grid-cols-4">
					<div>
						<h3 className="mb-4 text-xl font-semibold text-white">
							BookMyEvent
						</h3>

						<p className="text-sm leading-relaxed text-zinc-400">
							A modern platform for discovering,
							booking, and managing events.
						</p>
					</div>

					<div>
						<h4 className="mb-4 text-sm font-semibold text-white">
							Product
						</h4>

						<div className="flex flex-col gap-3">
							<Link
								to="/events"
								className="text-sm text-zinc-400 transition hover:text-white"
							>
								Events
							</Link>

							<Link
								to="/bookings"
								className="text-sm text-zinc-400 transition hover:text-white"
							>
								Bookings
							</Link>

							<Link
								to="/dashboard"
								className="text-sm text-zinc-400 transition hover:text-white"
							>
								Dashboard
							</Link>
						</div>
					</div>

					<div>
						<h4 className="mb-4 text-sm font-semibold text-white">
							Resources
						</h4>

						<div className="flex flex-col gap-3">
							<span className="text-sm text-zinc-400">
								Documentation
							</span>

							<span className="text-sm text-zinc-400">
								Help Center
							</span>

							<span className="text-sm text-zinc-400">
								Support
							</span>
						</div>
					</div>

					<div>
						<h4 className="mb-4 text-sm font-semibold text-white">
							Legal
						</h4>

						<div className="flex flex-col gap-3">
							<span className="text-sm text-zinc-400">
								Privacy Policy
							</span>

							<span className="text-sm text-zinc-400">
								Terms of Service
							</span>

							<span className="text-sm text-zinc-400">
								Cookies
							</span>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-zinc-800 pt-6">
					<p className="text-center text-sm text-zinc-500">
						© 2026 BookMyEvent. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;