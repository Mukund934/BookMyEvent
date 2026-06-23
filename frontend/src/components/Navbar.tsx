import { Link } from "react-router-dom";
import logo from "../assets/BookMyEventLogo.png";

const Navbar = () => {
	const token = localStorage.getItem(
		"bookmyevent_token"
	);

	const user = localStorage.getItem(
		"bookmyevent_user"
	);

	const parsedUser = user
		? JSON.parse(user)
		: null;

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
		<header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur">
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

				<Link
					to="/"
					className="flex items-center gap-3"
				>
<Link
	to="/"
	className="flex items-center gap-3"
>
	<img
		src={logo}
		alt="BookMyEvent"
		className="h-20 w-20 rounded-[30px] object-cover"
	/>

	<span className="text-2xl font-bold text-white">
		
	</span>
</Link>

					<span className="text-xl font-bold text-white">
						BookMyEvent
					</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					<Link
						to="/events"
						className="text-zinc-400 transition hover:text-white"
					>
						Events
					</Link>

					<Link
						to="/bookings"
						className="text-zinc-400 transition hover:text-white"
					>
						My Bookings
					</Link>

					<Link
						to="/dashboard"
						className="text-zinc-400 transition hover:text-white"
					>
						Dashboard
					</Link>
				</nav>

				<div className="flex items-center gap-3">

					{token && parsedUser ? (
						<>
							<div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#111113] px-3 py-2">

								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
									{parsedUser.name
										?.charAt(0)
										.toUpperCase()}
								</div>

								<span className="hidden text-sm text-zinc-300 md:block">
									{parsedUser.name}
								</span>

							</div>

							<button
								onClick={handleLogout}
								className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-sm text-zinc-300 transition hover:text-white"
							>
								Login
							</Link>

							<Link
								to="/register"
								className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
							>
								Get Started
							</Link>
						</>
					)}

				</div>

			</div>
		</header>
	);
};

export default Navbar;