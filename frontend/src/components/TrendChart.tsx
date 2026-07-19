interface Point {
	label: string;
	value: number;
	detail: string;
}

interface Props {
	points: Point[];
}

const TrendChart = ({ points }: Props) => {
	const max = Math.max(...points.map((point) => point.value), 1);

	return (
		<div className="flex h-52 items-end gap-2 overflow-x-auto pb-1">
			{points.map((point) => (
				<div
					key={point.label}
					className="group flex min-w-12 flex-1 flex-col items-center gap-2"
					title={point.detail}
				>
					<span className="text-xs tabular-nums text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
						{point.value}
					</span>

					<div
						role="img"
						aria-label={point.detail}
						className="flex w-full flex-1 items-end"
					>
						<div
							className="w-full rounded-t-lg bg-gradient-to-t from-violet-700/70 to-violet-400 transition-all duration-500 group-hover:from-violet-600 group-hover:to-violet-300 motion-reduce:transition-none"
							style={{
								height: `${Math.max(
									(point.value / max) * 100,
									point.value > 0 ? 4 : 1,
								)}%`,
							}}
						/>
					</div>

					<span className="text-xs text-zinc-500">
						{point.label}
					</span>
				</div>
			))}
		</div>
	);
};

export default TrendChart;
