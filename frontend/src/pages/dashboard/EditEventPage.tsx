import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import EventForm from "../../components/EventForm";
import ErrorState from "../../components/ErrorState";
import Skeleton from "../../components/Skeleton";

import type { EventFormValues } from "../../components/EventForm";
import type { Event } from "../../types/event.types";

import { getErrorMessage } from "../../utils/error";
import eventService from "../../services/event.service";

import { toast } from "sonner";

const toDateTimeLocal = (value: string) => {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "";

	const offset = date.getTimezoneOffset() * 60000;

	return new Date(date.getTime() - offset)
		.toISOString()
		.slice(0, 16);
};

const EditEventPage = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [failed, setFailed] = useState(false);
	const [reloadToken, setReloadToken] = useState(0);

	useEffect(() => {
		let active = true;

		const fetchEvent = async () => {
			try {
				if (!id) return;

				const response = await eventService.getEventById(id);

				if (!active) return;

				setEvent(response.data);

				setFailed(false);
			} catch (error) {
				console.error(error);

				if (active) {
					setFailed(true);
				}
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		fetchEvent();

		return () => {
			active = false;
		};
	}, [id, reloadToken]);

	const handleRetry = () => {
		setLoading(true);

		setFailed(false);

		setReloadToken((token) => token + 1);
	};

	const handleUpdate = async (values: EventFormValues) => {
		if (!id) return;

		try {
			await eventService.updateEvent(id, {
				title: values.title,
				description: values.description,
				date: values.date,
				location: values.location,
				category: values.category,
				imageUrl: values.imageUrl,
				price: Number(values.price),
				totalSeats: Number(values.totalSeats),
			});

			toast.success("Event updated successfully");

			navigate(`/events/${id}`);
		} catch (error) {
			toast.error(
				getErrorMessage(error, "Failed to update event"),
			);
		}
	};

	if (loading) {
		return (
			<Layout>
				<div className="mx-auto max-w-3xl px-6 py-12">
					<Skeleton className="h-10 w-56" />

					<Skeleton className="mt-8 h-[520px] rounded-2xl" />
				</div>
			</Layout>
		);
	}

	if (failed || !event) {
		return (
			<Layout>
				<div className="mx-auto max-w-3xl px-6 py-12">
					<ErrorState
						title="Could not load this event"
						description="The event could not be loaded for editing. Check your connection and try again."
						onRetry={handleRetry}
					/>
				</div>
			</Layout>
		);
	}

	const bookedSeats = event.totalSeats - event.availableSeats;

	return (
		<Layout>
			<div className="mx-auto max-w-3xl px-6 py-12">
				<h1 className="text-4xl font-bold tracking-tight text-white">
					Edit Event
				</h1>

				<p className="mb-8 mt-3 text-zinc-400">
					Update the details attendees see. Capacity cannot go below
					the {bookedSeats} seat{bookedSeats === 1 ? "" : "s"} already
					booked.
				</p>

				<EventForm
					submitLabel="Save Changes"
					pendingLabel="Saving..."
					minSeats={Math.max(1, bookedSeats)}
					initialValues={{
						title: event.title,
						description: event.description,
						date: toDateTimeLocal(event.date),
						location: event.location,
						category: event.category || "Other",
						imageUrl: event.imageUrl || "",
						price: String(event.price),
						totalSeats: String(event.totalSeats),
					}}
					onSubmit={handleUpdate}
				/>
			</div>
		</Layout>
	);
};

export default EditEventPage;
