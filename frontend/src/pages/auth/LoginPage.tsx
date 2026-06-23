import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
		} catch (err: any) {
			setError(
				err?.response?.data?.message ||
				"Login failed"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
				<div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#111113] lg:grid-cols-2">

					<div className="hidden border-r border-zinc-800 p-12 lg:flex lg:flex-col lg:justify-center">
						<div className="mb-6 flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-bold">
								B
							</div>

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
							<p>✓ Secure Authentication</p>
							<p>✓ Event Management Dashboard</p>
							<p>✓ Booking Tracking</p>
							<p>✓ Real-Time Insights</p>
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

								<div>
									<label className="mb-2 block text-sm text-zinc-300">
										Email Address
									</label>

									<input
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(
												e.target.value
											)
										}
										placeholder="you@example.com"
										className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm text-zinc-300">
										Password
									</label>

									<input
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(
												e.target.value
											)
										}
										placeholder="Enter password"
										className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
									/>
								</div>

								{error && (
									<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
										{error}
									</div>
								)}

								<div className="flex items-center justify-between text-sm">
									<label className="flex items-center gap-2 text-zinc-400">
										<input type="checkbox" />
										Remember Me
									</label>

									<button
										type="button"
										className="text-violet-400 hover:text-violet-300"
									>
										Forgot Password?
									</button>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full rounded-xl bg-violet-600 py-3 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{loading
										? "Signing In..."
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

						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default LoginPage;