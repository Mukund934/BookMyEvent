import type {
	InputHTMLAttributes,
	SelectHTMLAttributes,
	TextareaHTMLAttributes,
} from "react";

const controlClasses =
	"w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3 text-white outline-none transition-all duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10";

interface Props
	extends InputHTMLAttributes<HTMLInputElement>,
		Pick<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
	id: string;
	label: string;
	multiline?: boolean;
	options?: readonly string[];
	hint?: string;
}

const FormField = ({
	id,
	label,
	multiline,
	options,
	hint,
	rows,
	...rest
}: Props) => {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-2 block text-sm text-zinc-400"
			>
				{label}
			</label>

			{options ? (
				<select
					id={id}
					className={controlClasses}
					{...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
				>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			) : multiline ? (
				<textarea
					id={id}
					rows={rows}
					className={controlClasses}
					{...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
				/>
			) : (
				<input
					id={id}
					className={controlClasses}
					{...rest}
				/>
			)}

			{hint && (
				<p className="mt-2 text-xs text-zinc-500">
					{hint}
				</p>
			)}
		</div>
	);
};

export default FormField;
