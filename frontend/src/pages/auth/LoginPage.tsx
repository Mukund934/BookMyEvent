import { useState } from "react";

import FormField from "../../components/FormField";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/BookMyEventLogo.webp";
import { getErrorMessage } from "../../utils/error";
import authService from "../../services/auth.service";

const LoginPage = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		setError("");

		if (!email || !password) {
			setError("Please fill all fields");
			return;
		}

		try {
			setLoading(true);

			await authService.login({
				email,
				password,
			});

			navigate("/");
		} catch (err) {
			setError(
				getErrorMessage(
					err,
					"Login failed"
				)
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
				<div
	className="
		w-full
		max-w-6xl
		overflow-hidden
		rounded-3xl
		border
		border-zinc-800
		bg-[#111113]
		lg:grid
		lg:grid-cols-2
		transition-all
		duration-300
		hover:border-violet-500/20
		hover:shadow-2xl
		hover:shadow-violet-500/5
	"
>

					<div className="hidden border-r border-zinc-800 p-12 lg:flex lg:flex-col lg:justify-center">
						<div className="mb-6 flex items-center gap-3">
							<img
	src={logo}
	alt="BookMyEvent"
	className="h-30 w-30 rounded-[19px] object-cover"
/>

							<span className="text-2xl font-bold">
								BookMyEvent
							</span>
						</div>

						<h1 className="mb-4 text-4xl font-bold leading-tight">
							Manage Events.
							<br />
							Track Bookings.
							<br />
							Create Better Experiences.
						</h1>

						<p className="mb-8 text-zinc-400">
							A modern platform for discovering,
							booking, and managing events.
						</p>

						<div className="space-y-4 text-zinc-300">
							<p>✓ Secure JWT Authentication</p>
							<p>✓ Create & Manage Events</p>
							<p>✓ Smart Booking Management</p>
							<p>✓ Analytics Dashboard</p>
						</div>
					</div>

					<div className="p-8 md:p-12">
						<div className="mx-auto max-w-md">

							<h2 className="mb-2 text-3xl font-bold">
								Welcome Back
							</h2>

							<p className="mb-8 text-zinc-400">
								Sign in to your account
							</p>

							<form
								onSubmit={handleSubmit}
								className="space-y-5"
							>

								<FormField
									id="email"
									name="email"
									type="email"
									label="Email Address"
									placeholder="you@example.com"
									autoComplete="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>

								<FormField
									id="password"
									name="password"
									type="password"
									label="Password"
									placeholder="Your password"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>

								{error && (
									<div
										role="alert"
										className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
									>
										{error}
									</div>
								)}

								<div className="flex items-center justify-between text-sm">
									<span />

									<Link
										to="/forgot-password"
										className="text-violet-400 hover:text-violet-300"
									>
										Forgot Password?
									</Link>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="
	w-full
	rounded-xl
	bg-violet-600
	py-3
	font-medium
	text-white
	transition-all
	duration-200
	hover:bg-violet-500
	hover:shadow-lg
	hover:shadow-violet-500/20
	disabled:cursor-not-allowed
	disabled:opacity-70
"
								>
									{loading
										? "Authenticating... almost there"
										: "Sign In"}
								</button>

							</form>
                            

							<p className="mt-8 text-center text-zinc-400">
								Don't have an account?{" "}
								<Link
									to="/register"
									className="text-violet-400 hover:text-violet-300"
								>
									Create Account
								</Link>
							</p>

							<div className="mt-8 rounded-xl border border-zinc-800 bg-[#09090B] p-4">
	<p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
		Demo account
	</p>

	<p className="text-sm text-zinc-400">
		A shared, public account for trying the app. Anyone can sign in
		with it, so treat anything you create as visible to others.
	</p>

	<button
		type="button"
		onClick={() => {
			setEmail("test2@gmail.com");

			setPassword("12345678");

			setError("");
		}}
		className="mt-3 inline-flex rounded-lg border border-zinc-800 bg-[#111113] px-4 py-2 text-sm text-zinc-300 transition-all duration-200 hover:border-violet-500/30 hover:text-white"
	>
		Fill demo credentials
	</button>
</div>

						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default LoginPage;