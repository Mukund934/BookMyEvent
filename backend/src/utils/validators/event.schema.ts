import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description too short"),
    location: z.string().min(2),
    price: z.number().nonnegative(),
    totalSeats: z.number().positive(),
    date: z.string(),
  }),
});