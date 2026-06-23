import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../../services/auth.service";

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

			alert("Account created successfully");

			navigate("/login");
		} catch (error: any) {
			setError(
				error?.response?.data?.message ||
				"Registration failed"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
				<div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#111113] p-8 md:p-10">
					<h1 className="mb-2 text-3xl font-bold">
						Create Account
					</h1>

					<p className="mb-8 text-zinc-400">
						Get started with BookMyEvent
					</p>

					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<input
							type="text"
							placeholder="Full Name"
							value={name}
							onChange={(e) =>
								setName(
									e.target.value
								)
							}
							className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
							required
						/>

						<input
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) =>
								setEmail(
									e.target.value
								)
							}
							className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
							required
						/>

						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) =>
								setPassword(
									e.target.value
								)
							}
							className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
							required
						/>

						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(
									e.target.value
								)
							}
							className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition focus:border-violet-500"
							required
						/>

						{error && (
							<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-xl bg-violet-600 py-3 font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
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
							className="text-violet-400 hover:text-violet-300"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;