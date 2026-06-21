import { Router } from "express";

import {
	createEvent,
	getAllEvents,
	getEventById,
	getEventAnalytics,
} from "../../controllers/event.controller";

import { protect } from "../../middleware/auth.middleware";
import validate from "../../middleware/validate";
import { createEventSchema } from "../../utils/validators/event.schema";

const router = Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/create", validate(createEventSchema), createEvent);

router.get("/:id/analytics", protect, getEventAnalytics);

export default router;
