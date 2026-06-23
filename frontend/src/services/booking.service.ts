import api from "./api";

import type {
	CreateBookingRequest,
	CreateBookingResponse,
	MyBookingsResponse,
	CancelBookingResponse,
} from "../types/booking.types";

class BookingService {
	async createBooking(
		data: CreateBookingRequest,
	): Promise<CreateBookingResponse> {
		const response =
			await api.post<CreateBookingResponse>(
				"/bookings",
				data,
			);

		return response.data;
	}

	async getMyBookings(): Promise<MyBookingsResponse> {
		const response =
			await api.get<MyBookingsResponse>(
				"/bookings/my-bookings",
			);

		return response.data;
	}

	async cancelBooking(
		bookingId: string,
	): Promise<CancelBookingResponse> {
		const response =
			await api.delete<CancelBookingResponse>(
				`/bookings/${bookingId}`,
			);

		return response.data;
	}
}

export default new BookingService();