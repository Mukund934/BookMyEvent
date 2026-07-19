import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import EventForm from "../../components/EventForm";

import type { EventFormValues } from "../../components/EventForm";

import { getErrorMessage } from "../../utils/error";
import eventService from "../../services/event.service";

import { toast } from "sonner";

const CreateEventPage = () => {
	const navigate = useNavigate();

	const handleCreate = async (values: EventFormValues) => {
		try {
			await eventService.createEvent({
				title: values.title,
				description: values.description,
				date: values.date,
				location: values.location,
				category: values.category,
				imageUrl: values.imageUrl,
				price: Number(values.price),
				totalSeats: Number(values.totalSeats),
			});

			toast.success("Event created successfully");

			navigate("/dashboard");
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Failed to create event"),
			);
		}
	};

	return (
		<Layout>
			<div className="mx-auto max-w-3xl px-6 py-12">
				<h1 className="text-4xl font-bold tracking-tight text-white">
					Create Event
				</h1>

				<p className="mb-8 mt-3 text-zinc-400">
					Create and publish a new event for attendees to discover and
					book.
				</p>

				<EventForm
					submitLabel="Create Event"
					pendingLabel="Creating..."
					onSubmit={handleCreate}
				/>
			</div>
		</Layout>
	);
};

export default CreateEventPage;
