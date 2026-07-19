import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";

import ProtectedRoute from "./components/ProtectedRoute";
import Skeleton from "./components/Skeleton";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
	() => import("./pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
	() => import("./pages/auth/ResetPasswordPage")
);
const EventsPage = lazy(() => import("./pages/events/EventsPage"));
const EventDetailsPage = lazy(
	() => import("./pages/events/EventDetailsPage")
);
const MyBookingsPage = lazy(
	() => import("./pages/bookings/MyBookingsPage")
);
const TicketPage = lazy(
	() => import("./pages/bookings/TicketPage")
);
const DashboardPage = lazy(
	() => import("./pages/dashboard/DashboardPage")
);
const CreateEventPage = lazy(
	() => import("./pages/dashboard/CreateEventPage")
);
const EditEventPage = lazy(
	() => import("./pages/dashboard/EditEventPage")
);
const DocumentationPage = lazy(
	() => import("./pages/resources/DocumentationPage")
);
const HelpCenterPage = lazy(
	() => import("./pages/resources/HelpCenterPage")
);
const SupportPage = lazy(
	() => import("./pages/resources/SupportPage")
);
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const CookiesPage = lazy(() => import("./pages/legal/CookiesPage"));
const NotFoundPage = lazy(() => import("./pages/notfound/NotFoundPage"));

const RouteFallback = () => (
	<div className="min-h-screen bg-[#09090B] px-6 py-20">
		<div className="mx-auto max-w-7xl">
			<Skeleton className="h-10 w-56" />
		</div>
	</div>
);

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<RouteFallback />}>
				<Routes>
	<Route path="/" element={<LandingPage />} />

	<Route path="/login" element={<LoginPage />} />

	<Route path="/register" element={<RegisterPage />} />

	<Route
		path="/forgot-password"
		element={<ForgotPasswordPage />}
	/>

	<Route
		path="/reset-password"
		element={<ResetPasswordPage />}
	/>

	<Route path="/events" element={<EventsPage />} />

	<Route
		path="/events/:id"
		element={<EventDetailsPage />}
	/>

	<Route
		path="/bookings"
		element={
			<ProtectedRoute>
				<MyBookingsPage />
			</ProtectedRoute>
		}
	/>

	<Route
		path="/dashboard"
		element={
			<ProtectedRoute>
				<DashboardPage />
			</ProtectedRoute>
		}
	/>

	<Route
		path="/dashboard/create"
		element={
			<ProtectedRoute>
				<CreateEventPage />
			</ProtectedRoute>
		}
	/>

	<Route
		path="/dashboard/events/:id/edit"
		element={
			<ProtectedRoute>
				<EditEventPage />
			</ProtectedRoute>
		}
	/>

	<Route
		path="/bookings/:id/ticket"
		element={
			<ProtectedRoute>
				<TicketPage />
			</ProtectedRoute>
		}
	/>

	<Route path="/documentation" element={<DocumentationPage />} />

	<Route path="/help" element={<HelpCenterPage />} />

	<Route path="/support" element={<SupportPage />} />

	<Route path="/privacy" element={<PrivacyPage />} />

	<Route path="/terms" element={<TermsPage />} />

	<Route path="/cookies" element={<CookiesPage />} />

	<Route path="*" element={<NotFoundPage />} />
</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
