interface Props {
	title?: string;
	description?: string;
	onRetry: () => void;
}

const ErrorState = ({
	title = "Something went wrong",
	description = "We could not load this content. Check your connection and try again.",
	onRetry,
}: Props) => {
	return (
		<div
			role="alert"
			className="rounded-2xl border border-zinc-800 bg-[#111113] p-12 text-center"
		>
			<div
				aria-hidden="true"
				className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl"
			>
				⚠️
			</div>

			<h2 className="text-xl font-semibold text-white">
				{title}
			</h2>

			<p className="mx-auto mt-3 max-w-md text-zinc-400">
				{description}
			</p>

			<button
				onClick={onRetry}
				className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
			>
				Try Again
			</button>
		</div>
	);
};

export default ErrorState;
