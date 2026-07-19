import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import eventService from "../../services/event.service";

import { toast } from "sonner";

const CreateEventPage = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		location: "",
		price: "",
		totalSeats: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validate = () => {
		if (formData.title.trim().length < 3) {
			return "Title must be at least 3 characters";
		}

		if (formData.description.trim().length < 10) {
			return "Description must be at least 10 characters";
		}

		if (formData.location.trim().length < 2) {
			return "Location must be at least 2 characters";
		}

		if (!formData.date) {
			return "Date is required";
		}

		if (new Date(formData.date).getTime() <= Date.now()) {
			return "Date must be in the future";
		}

		if (!formData.price || Number(formData.price) < 0) {
			return "Price cannot be negative";
		}

		if (Number(formData.totalSeats) < 1) {
			return "Total seats must be at least 1";
		}

		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (loading) return;

		const validationError = validate();

		if (validationError) {
			toast.error(validationError);

			return;
		}

		try {
			setLoading(true);

			await eventService.createEvent({
				title: formData.title.trim(),
				description: formData.description.trim(),
				date: formData.date,
				location: formData.location.trim(),
				price: Number(formData.price),
				totalSeats: Number(formData.totalSeats),
			});

			toast.success("Event created successfully");

			navigate("/events");
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message || "Failed to create event",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<div className="mx-auto max-w-3xl px-6 py-12">
				<h1 className="text-4xl font-bold tracking-tight text-white">
					Create Event
				</h1>

				<p className="mt-3 text-zinc-400">
					Create and publish a new event for attendees to discover and
					book.
				</p>

				<form
					onSubmit={handleSubmit}
					className="
	space-y-6
	rounded-2xl
	border
	border-zinc-800
	bg-[#111113]
	p-8
	transition-all
	duration-200
	hover:border-violet-500/20
"
				>
                    
					<input
						name="title"
						required
						placeholder="Event Title"
						value={formData.title}
						onChange={handleChange}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>

					<textarea
						name="description"
						required
						placeholder="Description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>

					<input
						type="datetime-local"
						name="date"
						required
						value={formData.date}
						onChange={handleChange}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>

					<input
						name="location"
						required
						placeholder="Location"
						value={formData.location}
						onChange={handleChange}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>

                    <div className="grid gap-5 md:grid-cols-2">
					<input
						type="number"
						name="price"
						required
						min="0"
						placeholder="Price"
						value={formData.price}
						onChange={handleChange}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>

					<input
						type="number"
						name="totalSeats"
						required
						min="1"
						placeholder="Total Seats"
						value={formData.totalSeats}
						onChange={handleChange}
						className="
	w-full
	rounded-xl
	border
	border-zinc-700
	bg-[#09090B]
	p-3
	text-white
	outline-none
	transition-all
	duration-200
	focus:border-violet-500
	focus:ring-2
	focus:ring-violet-500/10
"
					/>
                    </div>

					<button
						type="submit"
						disabled={loading}
						className="
	w-full
	rounded-xl
	bg-violet-600
	py-3
	font-medium
	text-white
	transition-all
	duration-200
	hover:bg-violet-500
	hover:shadow-lg
	hover:shadow-violet-500/20
	disabled:cursor-not-allowed
	disabled:opacity-50
"
					>
						{loading ? "Creating..." : "Create Event"}
					</button>
				</form>
			</div>
		</Layout>
	);
};

export default CreateEventPage;
