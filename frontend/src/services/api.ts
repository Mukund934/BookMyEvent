import axios from "axios";

const API_BASE_URL =
	"https://bookmyevent-backend-2u7p.onrender.com/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type":
			"application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token =
			localStorage.getItem(
				"bookmyevent_token"
			);

		if (token) {
			config.headers.Authorization =
				`Bearer ${token}`;
		}

		return config;
	},
	(error) =>
		Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const requestUrl =
			error.config?.url || "";

		if (
			error.response?.status ===
				401 &&
			!requestUrl.startsWith(
				"/auth/"
			)
		) {
			localStorage.removeItem(
				"bookmyevent_token"
			);

			localStorage.removeItem(
				"bookmyevent_user"
			);

			window.location.href =
				"/login";
		}

		return Promise.reject(error);
	}
);

export default api;