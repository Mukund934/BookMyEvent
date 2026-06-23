export interface BookingEvent {
	_id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	price: number;
}

export interface Booking {
	_id: string;

	event: BookingEvent;

	seatsBooked: number;
	totalAmount: number;

	status: "active" | "cancelled";

	createdAt: string;
	updatedAt?: string;
}

export interface CreateBookingRequest {
	eventId: string;
	seats: number;
}

export interface CreateBookingResponse {
	success: boolean;
	message: string;
	data: Booking;
}

export interface MyBookingsResponse {
	success: boolean;
	source: string;

	bookings: Booking[];

	total: number;
	page: number;
	totalPages: number;
}

export interface CancelBookingResponse {
	success: boolean;
	message: string;
	data: Booking;
}