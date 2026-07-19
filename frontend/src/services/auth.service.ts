import api from "./api";

import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	User,
} from "../types/auth.types";

class AuthService {
	async register(
		data: RegisterRequest
	): Promise<RegisterResponse> {
		const response =
			await api.post(
				"/auth/register",
				data
			);

		return response.data;
	}

	async login(
		data: LoginRequest
	): Promise<LoginResponse> {
		const response =
			await api.post(
				"/auth/login",
				data
			);

		const {
			token,
			user,
		}: {
			token: string;
			user: User;
		} = response.data;

		localStorage.setItem(
			"bookmyevent_token",
			token
		);

		localStorage.setItem(
			"bookmyevent_user",
			JSON.stringify(user)
		);

		return response.data;
	}

	async forgotPassword(
		email: string
	) {
		const response =
			await api.post(
				"/auth/forgot-password",
				{ email }
			);

		return response.data;
	}

	async resetPassword(
		token: string,
		password: string
	) {
		const response =
			await api.post(
				"/auth/reset-password",
				{ token, password }
			);

		return response.data;
	}

	logout() {
		localStorage.removeItem(
			"bookmyevent_token"
		);

		localStorage.removeItem(
			"bookmyevent_user"
		);
	}

	getUser(): User | null {
		const user =
			localStorage.getItem(
				"bookmyevent_user"
			);

		return user
			? JSON.parse(user)
			: null;
	}

	getToken(): string | null {
		return localStorage.getItem(
			"bookmyevent_token"
		);
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}

export default new AuthService();