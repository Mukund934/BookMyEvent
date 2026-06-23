import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EventsPage from "./pages/events/EventsPage";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import MyBookingsPage from "./pages/bookings/MyBookingsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CreateEventPage from "./pages/dashboard/CreateEventPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
	<Route path="/" element={<LandingPage />} />

	<Route path="/login" element={<LoginPage />} />

	<Route path="/register" element={<RegisterPage />} />

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
</Routes>
		</BrowserRouter>
	);
}

export default App;
