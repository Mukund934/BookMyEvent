import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
	interactive?: boolean;
}

const Card = ({
	children,
	className = "",
	interactive,
}: Props) => {
	return (
		<div
			className={`rounded-2xl border border-zinc-800 bg-[#111113] transition-all duration-200${
				interactive
					? " hover:-translate-y-1 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5"
					: ""
			} ${className}`}
		>
			{children}
		</div>
	);
};

export default Card;
