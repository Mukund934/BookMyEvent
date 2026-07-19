interface Bar {
	label: string;
	value: number;
	caption?: string;
}

interface Props {
	bars: Bar[];
	format?: (value: number) => string;
}

const BarChart = ({ bars, format }: Props) => {
	const max = Math.max(...bars.map((bar) => bar.value), 1);

	return (
		<ul className="space-y-4">
			{bars.map((bar) => (
				<li key={bar.label} className="space-y-2">
					<div className="flex items-baseline justify-between gap-4">
						<span className="truncate text-sm text-zinc-300">
							{bar.label}
						</span>

						<span className="shrink-0 text-sm font-medium tabular-nums text-white">
							{format ? format(bar.value) : bar.value}
						</span>
					</div>

					<div
						role="img"
						aria-label={`${bar.label}: ${
							format ? format(bar.value) : bar.value
						}`}
						className="h-2 overflow-hidden rounded-full bg-zinc-800"
					>
						<div
							className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500 motion-reduce:transition-none"
							style={{
								width: `${Math.max(
									(bar.value / max) * 100,
									bar.value > 0 ? 2 : 0,
								)}%`,
							}}
						/>
					</div>

					{bar.caption && (
						<p className="text-xs text-zinc-500">
							{bar.caption}
						</p>
					)}
				</li>
			))}
		</ul>
	);
};

export default BarChart;
