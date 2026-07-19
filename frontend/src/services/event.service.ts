import api from "./api";

import type {
	EventDetailsResponse,
	EventsResponse,
} from "../types/event.types";

export interface CreateEventRequest {
	title: string;
	description: string;
	date: string;
	location: string;
	category?: string;
	imageUrl?: string;
	price: number;
	totalSeats: number;
}

export interface EventQuery {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
}

class EventService {
	async getEvents(
		query: EventQuery = {}
	) {
		const response =
			await api.get<EventsResponse>(
				"/events",
				{ params: query }
			);

		return response.data;
	}

	async getEventById(id: string) {
		const response =
			await api.get<EventDetailsResponse>(
				`/events/${id}`
			);

		return response.data;
	}

	async createEvent(
		data: CreateEventRequest
	) {
		const response =
			await api.post(
				"/events/create",
				data
			);

		return response.data;
	}

	async updateEvent(
		id: string,
		data: Partial<CreateEventRequest>
	) {
		const response =
			await api.put(
				`/events/${id}`,
				data
			);

		return response.data;
	}

	async deleteEvent(id: string) {
		const response =
			await api.delete(
				`/events/${id}`
			);

		return response.data;
	}
}

export default new EventService();