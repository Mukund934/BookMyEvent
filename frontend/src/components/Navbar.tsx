import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/BookMyEventLogo.webp";

const Navbar = () => {
	const [menuOpen, setMenuOpen] =
		useState(false);

	const token = localStorage.getItem(
		"bookmyevent_token"
	);

	const user = localStorage.getItem(
		"bookmyevent_user"
	);

	let parsedUser;

	try {
		parsedUser = user ? JSON.parse(user) : null;
	} catch {
		parsedUser = null;
	}

	const handleLogout = () => {
		localStorage.removeItem(
			"bookmyevent_token"
		);

		localStorage.removeItem(
			"bookmyevent_user"
		);

		window.location.href = "/";
	};

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur-xl">
            
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

				<Link
					to="/"
					className="flex items-center gap-3"
				>
					<img
						src={logo}
						alt="BookMyEvent"
						className="h-20 w-20 rounded-[30px] object-cover"
					/>

					<span className="hidden text-xl font-bold text-white sm:block">
						BookMyEvent
					</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					<Link
						to="/events"
							className="
		flex
		items-center
		gap-3
		rounded-xl
		border
		border-zinc-800
		bg-[#111113]
		px-3
		py-2
		transition-all
		duration-200
		hover:border-violet-300
        hover:text-violet-500/60
	"
					>
						Events
					</Link>

					<Link
						to="/bookings"
						className="
		flex
		items-center
		gap-7
		rounded-xl
		border
		border-zinc-800
		bg-[#111113]
		px-3
		py-2
		transition-all
		duration-200
		hover:border-violet-300
        hover:text-violet-500/60
	"
					>
						My Bookings
					</Link>

					<Link
						to="/dashboard"
className="
		flex
		items-center
		gap-3
		rounded-xl
		border
		border-zinc-800
		bg-[#111113]
		px-3
		py-2
		transition-all
		duration-200
		hover:border-violet-300
        hover:text-violet-500/60
	"					>
						Dashboard
					</Link>
				</nav>

				<div className="flex items-center gap-3">

					{token && parsedUser ? (
						<>
							<div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2">

								<div className="
	flex
	h-9
	w-9
	items-center
	justify-center
	rounded-full
	bg-gradient-to-br
	from-violet-500
	to-violet-700
	text-sm
	font-semibold
	text-white
">
									{parsedUser.name
										?.charAt(0)
										.toUpperCase()}
								</div>

								<div className="hidden md:block">
	<p className="text-sm font-medium text-white">
		{parsedUser.name}
	</p>

	<p className="text-xs text-zinc-500">
		Member
	</p>
</div>

							</div>

							<button
								onClick={handleLogout}
								className="
	rounded-xl
	border
	border-zinc-800
	bg-[#111113]
	px-4
	py-2
	text-sm
	text-zinc-400
	transition-all
	duration-200
	hover:border-red-300
	hover:text-red-400
"
							>
								Logout
							</button>
						</>
					) : (
						<>
							
<div className="flex flex-col items-end">
	<Link
		to="/register"
		className="
			rounded-xl
			bg-violet-600
			px-5
			py-2.5
			text-sm
			font-medium
			text-white
			transition-all
			duration-200
			hover:bg-violet-500
			hover:shadow-lg
			hover:shadow-violet-500/20
		"
	>
		Get Started
	</Link>

	<Link
		to="/login"
		className="
			mt-1
			text-xs
			text-zinc-500
			transition
			hover:text-violet-400
		"
	>
		Already a member? Sign in
	</Link>
</div>


						</>
					)}

					<button
						onClick={() =>
							setMenuOpen(!menuOpen)
						}
						aria-label="Toggle navigation"
						aria-expanded={menuOpen}
						className="
		rounded-xl
		border
		border-zinc-800
		bg-[#111113]
		px-3
		py-2
		text-zinc-400
		transition-all
		duration-200
		hover:border-violet-300
		hover:text-violet-400
		md:hidden
	"
					>
						{menuOpen ? "✕" : "☰"}
					</button>

				</div>

			</div>

			{menuOpen && (
				<nav className="border-t border-zinc-800 bg-[#09090B] px-6 py-4 md:hidden">
					<div className="flex flex-col gap-3">
						<Link
							to="/events"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2 text-zinc-300 transition-all duration-200 hover:border-violet-300 hover:text-violet-400"
						>
							Events
						</Link>

						<Link
							to="/bookings"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2 text-zinc-300 transition-all duration-200 hover:border-violet-300 hover:text-violet-400"
						>
							My Bookings
						</Link>

						<Link
							to="/dashboard"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2 text-zinc-300 transition-all duration-200 hover:border-violet-300 hover:text-violet-400"
						>
							Dashboard
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
};

export default Navbar;