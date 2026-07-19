import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import logo from "../../assets/BookMyEventLogo.webp";

import FormField from "../../components/FormField";
import Button from "../../components/Button";

import authService from "../../services/auth.service";
import { getErrorMessage } from "../../utils/error";

import { toast } from "sonner";

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();

	const navigate = useNavigate();

	const token = searchParams.get("token") || "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (loading) return;

		if (password.length < 8) {
			setError("Password must be at least 8 characters");

			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");

			return;
		}

		try {
			setLoading(true);

			setError("");

			await authService.resetPassword(token, password);

			toast.success("Password updated. Please sign in.");

			navigate("/login");
		} catch (err) {
			setError(
				getErrorMessage(err, "Could not reset your password"),
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
						Choose a new password
					</h1>

					{token ? (
						<>
							<p className="mt-3 mb-6 text-zinc-400">
								Pick something at least 8 characters long.
							</p>

							<form
								onSubmit={handleSubmit}
								className="space-y-5"
							>
								<FormField
									id="password"
									name="password"
									type="password"
									label="New Password"
									placeholder="At least 8 characters"
									autoComplete="new-password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>

								<FormField
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									label="Confirm New Password"
									placeholder="Repeat your password"
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
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
										? "Updating..."
										: "Update Password"}
								</Button>
							</form>
						</>
					) : (
						<>
							<p
								role="alert"
								className="mt-3 text-zinc-400"
							>
								This reset link is missing its token. Request a
								new link and try again.
							</p>

							<Link
								to="/forgot-password"
								className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								Request a New Link
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
