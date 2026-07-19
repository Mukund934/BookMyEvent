import type { ReactNode } from "react";

import Layout from "./Layout";

interface Props {
	eyebrow: string;
	title: string;
	intro: string;
	updated?: string;
	children: ReactNode;
}

const ContentPage = ({
	eyebrow,
	title,
	intro,
	updated,
	children,
}: Props) => {
	return (
		<Layout>
			<div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
				<span className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-400">
					{eyebrow}
				</span>

				<h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
					{title}
				</h1>

				<p className="mt-4 text-lg text-zinc-400">
					{intro}
				</p>

				{updated && (
					<p className="mt-3 text-sm text-zinc-500">
						Last updated {updated}
					</p>
				)}

				<div className="mt-12 space-y-10">
					{children}
				</div>
			</div>
		</Layout>
	);
};

interface SectionProps {
	title: string;
	children: ReactNode;
}

export const Section = ({ title, children }: SectionProps) => {
	return (
		<section className="space-y-3">
			<h2 className="text-xl font-semibold text-white">
				{title}
			</h2>

			<div className="space-y-3 leading-relaxed text-zinc-400">
				{children}
			</div>
		</section>
	);
};

export default ContentPage;
