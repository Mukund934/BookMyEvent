import type { SelectHTMLAttributes } from "react";

interface Option {
	value: string;
	label: string;
}

interface Props
	extends SelectHTMLAttributes<HTMLSelectElement> {
	options: Option[];
}

const Select = ({
	options,
	className = "",
	...rest
}: Props) => {
	return (
		<div className="relative">
			<select
				className={`w-full appearance-none rounded-xl border border-zinc-800 bg-[#111113] py-3 pl-4 pr-10 text-sm text-zinc-300 outline-none transition-all duration-200 hover:border-violet-500/30 hover:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 ${className}`}
				{...rest}
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						className="bg-[#111113] text-zinc-200"
					>
						{option.label}
					</option>
				))}
			</select>

			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500"
			>
				▾
			</span>
		</div>
	);
};

export default Select;
