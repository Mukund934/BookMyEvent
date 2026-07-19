import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const base =
	"inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
	primary:
		"bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20",
	secondary:
		"border border-zinc-800 bg-[#111113] text-zinc-300 hover:border-zinc-700 hover:text-white",
	danger:
		"bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20",
};

interface Props
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	fullWidth?: boolean;
}

const Button = ({
	variant = "primary",
	fullWidth,
	className = "",
	type = "button",
	...rest
}: Props) => {
	return (
		<button
			type={type}
			className={`${base} ${variants[variant]}${fullWidth ? " w-full" : ""} ${className}`}
			{...rest}
		/>
	);
};

export default Button;
