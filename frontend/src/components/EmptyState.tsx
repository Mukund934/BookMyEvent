import type { ReactNode } from "react";

interface Props {
	icon: string;
	title: string;
	description: string;
	action?: ReactNode;
}

const EmptyState = ({
	icon,
	title,
	description,
	action,
}: Props) => {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-12 text-center">
			<div
				aria-hidden="true"
				className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl"
			>
				{icon}
			</div>

			<h2 className="text-xl font-semibold text-white">
				{title}
			</h2>

			<p className="mx-auto mt-3 max-w-md text-zinc-400">
				{description}
			</p>

			{action && (
				<div className="mt-6">
					{action}
				</div>
			)}
		</div>
	);
};

export default EmptyState;
