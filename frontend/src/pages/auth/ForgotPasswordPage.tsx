import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/BookMyEventLogo.webp";

import FormField from "../../components/FormField";
import Button from "../../components/Button";

import authService from "../../services/auth.service";
import { getErrorMessage } from "../../utils/error";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (loading) return;

		if (!email.trim()) {
			setError("Email is required");

			return;
		}

		try {
			setLoading(true);

			setError("");

			await authService.forgotPassword(email.trim());

			setSent(true);
		} catch (err) {
			setError(
				getErrorMessage(err, "Could not send the reset link"),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 py-16 text-white">
			<div className="w-full max-w-md">
				<Link
					to="/"
					className="mb-8 flex items-center justify-center"
				>
					<img
						src={logo}
						alt="BookMyEvent"
						className="h-16 w-16 rounded-[24px] object-cover"
					/>
				</Link>

				<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
					<h1 className="text-2xl font-bold tracking-tight text-white">
						Reset your password
					</h1>

					{sent ? (
						<>
							<p
								role="status"
								className="mt-3 text-zinc-400"
							>
								If an account exists for{" "}
								<span className="text-zinc-200">
									{email.trim()}
								</span>
								, a reset link is on its way. The link expires in
								30 minutes.
							</p>

							<Link
								to="/login"
								className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								Back to Sign In
							</Link>
						</>
					) : (
						<>
							<p className="mt-3 mb-6 text-zinc-400">
								Enter the email you signed up with and we will
								send you a link to set a new password.
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
									onChange={(e) =>
										setEmail(e.target.value)
									}
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

								<Button
									type="submit"
									disabled={loading}
									fullWidth
								>
									{loading
										? "Sending..."
										: "Send Reset Link"}
								</Button>
							</form>
						</>
					)}
				</div>

				<p className="mt-8 text-center text-zinc-400">
					Remembered it?{" "}
					<Link
						to="/login"
						className="text-violet-400 hover:text-violet-300"
					>
						Sign In
					</Link>
				</p>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
