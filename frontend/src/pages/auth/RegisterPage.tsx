import { useState } from "react";

import FormField from "../../components/FormField";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/auth.service";
import logo from "../../assets/BookMyEventLogo.webp";
import { getErrorMessage } from "../../utils/error";

const RegisterPage = () => {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] =
		useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			setLoading(true);

			await authService.register({
				name,
				email,
				password,
			});

			navigate("/login");
		} catch (error) {
			setError(
				getErrorMessage(
					error,
					"Registration failed"
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
								className="h-14 w-14 rounded-[18px] object-cover"
							/>

							<span className="text-2xl font-bold">
								BookMyEvent
							</span>
						</div>

						<h1 className="mb-4 text-4xl font-bold leading-tight">
							Discover Events.
							<br />
							Book Instantly.
							<br />
							Manage Seamlessly.
						</h1>

						<p className="mb-8 text-zinc-400">
							Create your account and start
							exploring events, managing bookings,
							and building experiences.
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
								Create Account
							</h2>

							<p className="mb-8 text-zinc-400">
								Get started with BookMyEvent
							</p>

							<form
								onSubmit={handleSubmit}
								className="space-y-5"
							>

								<FormField
									id="name"
									name="name"
									type="text"
									label="Full Name"
									placeholder="Your name"
									autoComplete="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>

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
									placeholder="At least 8 characters"
									autoComplete="new-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>

								<FormField
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									label="Confirm Password"
									placeholder="Repeat your password"
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
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
										? "Creating Account..."
										: "Create Account"}
								</button>

							</form>

							<p className="mt-8 text-center text-zinc-400">
								Already have an account?{" "}
								<Link
									to="/login"
									className="text-violet-400 transition hover:text-violet-300"
								>
									Sign In
								</Link>
							</p>

						</div>

					</div>

				</div>

			</div>
		</div>
	);
};

export default RegisterPage;