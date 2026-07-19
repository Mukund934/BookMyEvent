import { z } from "zod";

export const EVENT_CATEGORIES = [
  "Music",
  "Sports",
  "Technology",
  "Business",
  "Arts",
  "Food",
  "Other",
] as const;

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description too short"),
    location: z.string().min(2),
    price: z.number().nonnegative(),
    totalSeats: z.number().positive(),
    date: z.string(),
    category: z.enum(EVENT_CATEGORIES).optional(),
    imageUrl: z.string().url("Image must be a valid URL").or(z.literal("")).optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .optional(),
    description: z
      .string()
      .min(10, "Description too short")
      .optional(),
    location: z.string().min(2).optional(),
    price: z.number().nonnegative().optional(),
    totalSeats: z.number().positive().optional(),
    date: z.string().optional(),
    category: z.enum(EVENT_CATEGORIES).optional(),
    imageUrl: z.string().url("Image must be a valid URL").or(z.literal("")).optional(),
  }),
});