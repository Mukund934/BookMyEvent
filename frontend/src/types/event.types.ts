export interface Organizer {
	_id: string;
	name: string;
	email: string;
}

export interface Event {
	_id: string;
	title: string;
	description: string;
	date: string;
	location: string;
	price: number;
	totalSeats: number;
	availableSeats: number;
	organizer: string | Organizer;
	createdAt: string;
	updatedAt: string;
}

export interface EventsResponse {
	success: boolean;
	source: string;
	data: {
		events: Event[];
		pagination: {
			page: number;
			limit: number;
			totalPages: number;
			totalEvents: number;
		};
	};
}

export interface EventDetailsResponse {
	success: boolean;
	source: string;
	data: Event;
}