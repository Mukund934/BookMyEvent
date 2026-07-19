import { Link } from "react-router-dom";

import Layout from "../../components/Layout";

const NotFoundPage = () => {
	return (
		<Layout>
			<div className="mx-auto max-w-7xl px-6 py-20">
				<div className="rounded-2xl border border-zinc-800 bg-[#111113] p-12 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-3xl">
						🧭
					</div>

					<h1 className="text-xl font-semibold text-white">
						Page not found
					</h1>

					<p className="mt-3 text-zinc-400">
						The page you are looking for does not exist or has been moved.
					</p>

					<Link
						to="/events"
						className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
					>
						Browse Events
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default NotFoundPage;
