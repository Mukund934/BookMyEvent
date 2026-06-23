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
	price: number;
	totalSeats: number;
}

class EventService {
	async getEvents() {
		const response =
			await api.get<EventsResponse>(
				"/events"
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
}

export default new EventService();