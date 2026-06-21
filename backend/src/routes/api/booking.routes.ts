import { Router } from "express";

import { protect } from "../../middleware/auth.middleware";
import { bookEvent, getMyBookings } from "../../controllers/booking.controller";

const router = Router();

router.post("/", protect, bookEvent);

router.get("/my-bookings", protect, getMyBookings);

export default router;
