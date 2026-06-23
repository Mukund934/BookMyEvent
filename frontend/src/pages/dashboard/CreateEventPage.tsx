import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import eventService from "../../services/event.service";

import { toast } from "sonner";

const CreateEventPage = () => {
	const navigate = useNavigate();

	const [formData, setFormData] =
		useState({
			title: "",
			description: "",
			date: "",
			location: "",
			price: "",
			totalSeats: "",
		});

	const [loading, setLoading] =
		useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>
	) => {
		setFormData({
			...formData,
			[e.target.name]:
				e.target.value,
		});
	};

	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		try {
			setLoading(true);

			await eventService.createEvent({
				title: formData.title,
				description:
					formData.description,
				date: formData.date,
				location:
					formData.location,
				price: Number(
					formData.price
				),
				totalSeats: Number(
					formData.totalSeats
				),
			});

			toast.success(
				"Event created successfully"
			);

			navigate("/events");
		} catch (error: any) {
			toast.error(
				error?.response?.data
					?.message ||
					"Failed to create event"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<div className="mx-auto max-w-3xl px-6 py-12">

				<h1 className="mb-8 text-4xl font-bold text-white">
					Create Event
				</h1>

				<form
					onSubmit={handleSubmit}
					className="space-y-5 rounded-2xl border border-zinc-800 bg-[#111113] p-8"
				>

					<input
						name="title"
						placeholder="Event Title"
						value={
							formData.title
						}
						onChange={
							handleChange
						}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<textarea
						name="description"
						placeholder="Description"
						value={
							formData.description
						}
						onChange={
							handleChange
						}
						rows={4}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<input
						type="datetime-local"
						name="date"
						value={
							formData.date
						}
						onChange={
							handleChange
						}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<input
						name="location"
						placeholder="Location"
						value={
							formData.location
						}
						onChange={
							handleChange
						}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<input
						type="number"
						name="price"
						placeholder="Price"
						value={
							formData.price
						}
						onChange={
							handleChange
						}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<input
						type="number"
						name="totalSeats"
						placeholder="Total Seats"
						value={
							formData.totalSeats
						}
						onChange={
							handleChange
						}
						className="w-full rounded-xl border border-zinc-700 bg-[#09090B] p-3 text-white"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-violet-600 py-3 text-white hover:bg-violet-500"
					>
						{loading
							? "Creating..."
							: "Create Event"}
					</button>

				</form>

			</div>
		</Layout>
	);
};

export default CreateEventPage;