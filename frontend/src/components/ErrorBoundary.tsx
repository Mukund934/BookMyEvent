import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	state: State = {
		hasError: false,
	};

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("Application error:", error, info);
	}

	handleReset = () => {
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 text-white">
					<div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111113] p-12 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl">
							⚠️
						</div>

						<h1 className="text-xl font-semibold text-white">
							Something went wrong
						</h1>

						<p className="mt-3 text-zinc-400">
							This page could not be displayed. Returning
							to the home page usually resolves it.
						</p>

						<button
							onClick={this.handleReset}
							className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
						>
							Back to Home
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
