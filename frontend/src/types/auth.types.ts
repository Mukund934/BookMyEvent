export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	token: string;
	user: User;
}

export interface RegisterResponse {
	success: boolean;
	message: string;
	user: User;
}

