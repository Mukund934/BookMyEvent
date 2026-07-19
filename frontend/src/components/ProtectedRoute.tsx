import { Navigate } from "react-router-dom";

interface Props {
	children: React.ReactNode;
}

const isTokenActive = (
	token: string
) => {
	try {
		const payload = JSON.parse(
			atob(
				token
					.split(".")[1]
					.replace(/-/g, "+")
					.replace(/_/g, "/")
			)
		);

		return (
			payload.exp * 1000 >
			Date.now()
		);
	} catch {
		return false;
	}
};

const ProtectedRoute = ({
	children,
}: Props) => {
	const token =
		localStorage.getItem(
			"bookmyevent_token"
		);

	if (
		!token ||
		!isTokenActive(token)
	) {
		localStorage.removeItem(
			"bookmyevent_token"
		);

		localStorage.removeItem(
			"bookmyevent_user"
		);

		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
