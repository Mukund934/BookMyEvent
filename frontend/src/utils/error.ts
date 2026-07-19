import type { AxiosError } from "axios";

export const getErrorMessage = (
	error: unknown,
	fallback: string,
) => {
	const message = (
		error as AxiosError<{ message?: string }>
	)?.response?.data?.message;

	return message || fallback;
};
