interface Props {
	className?: string;
}

const Skeleton = ({ className = "" }: Props) => {
	return (
		<div
			aria-hidden="true"
			className={`animate-pulse rounded-xl bg-zinc-800/60 motion-reduce:animate-none ${className}`}
		/>
	);
};

export default Skeleton;
