import type { ReactNode } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<div className="min-h-screen bg-[#09090B] text-white">
			<Navbar />

			<main>
				{children}
			</main>

			<Footer />
		</div>
	);
};

export default Layout;