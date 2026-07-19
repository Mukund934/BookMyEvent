import { useState } from "react";

import FormField from "./FormField";
import Button from "./Button";

import { toast } from "sonner";

import { EVENT_CATEGORIES } from "../utils/categories";

export interface EventFormValues {
	title: string;
	description: string;
	date: string;
	location: string;
	category: string;
	imageUrl: string;
	price: string;
	totalSeats: string;
}

const emptyValues: EventFormValues = {
	title: "",
	description: "",
	date: "",
	location: "",
	category: "Other",
	imageUrl: "",
	price: "",
	totalSeats: "",
};

interface Props {
	initialValues?: Partial<EventFormValues>;
	submitLabel: string;
	pendingLabel: string;
	minSeats?: number;
	onSubmit: (values: EventFormValues) => Promise<void>;
}

const EventForm = ({
	initialValues,
	submitLabel,
	pendingLabel,
	minSeats = 1,
	onSubmit,
}: Props) => {
	const [formData, setFormData] = useState<EventFormValues>({
		...emptyValues,
		...initialValues,
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			| HTMLInputElement
			| HTMLTextAreaElement
			| HTMLSelectElement
		>,
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

		if (!formData.price || Number(formData.price) < 0) {
			return "Price cannot be negative";
		}

		if (Number(formData.totalSeats) < minSeats) {
			return `Total seats cannot be below ${minSeats}`;
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

			await onSubmit({
				...formData,
				title: formData.title.trim(),
				description: formData.description.trim(),
				location: formData.location.trim(),
				imageUrl: formData.imageUrl.trim(),
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 rounded-2xl border border-zinc-800 bg-[#111113] p-8"
		>
			<FormField
				id="title"
				name="title"
				label="Event Title"
				placeholder="Summer Music Festival"
				value={formData.title}
				onChange={handleChange}
				required
			/>

			<FormField
				id="description"
				name="description"
				label="Description"
				placeholder="Tell attendees what to expect"
				value={formData.description}
				onChange={handleChange}
				multiline
				rows={4}
				required
			/>

			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					id="date"
					name="date"
					label="Date and Time"
					type="datetime-local"
					value={formData.date}
					onChange={handleChange}
					required
				/>

				<FormField
					id="category"
					name="category"
					label="Category"
					options={EVENT_CATEGORIES}
					value={formData.category}
					onChange={handleChange}
				/>
			</div>

			<FormField
				id="location"
				name="location"
				label="Location"
				placeholder="Raipur"
				value={formData.location}
				onChange={handleChange}
				required
			/>

			<FormField
				id="imageUrl"
				name="imageUrl"
				label="Cover Image URL"
				type="url"
				placeholder="https://example.com/cover.jpg"
				value={formData.imageUrl}
				onChange={handleChange}
				hint="Optional. Leave empty to use the default cover."
			/>

			<div className="grid gap-5 md:grid-cols-2">
				<FormField
					id="price"
					name="price"
					label="Price"
					type="number"
					min="0"
					placeholder="499"
					value={formData.price}
					onChange={handleChange}
					required
				/>

				<FormField
					id="totalSeats"
					name="totalSeats"
					label="Total Seats"
					type="number"
					min={minSeats}
					placeholder="100"
					value={formData.totalSeats}
					onChange={handleChange}
					required
				/>
			</div>

			<Button
				type="submit"
				disabled={loading}
				fullWidth
			>
				{loading ? pendingLabel : submitLabel}
			</Button>
		</form>
	);
};

export default EventForm;
