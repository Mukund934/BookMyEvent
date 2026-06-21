import { Router } from "express";

import {
	createEvent,
	getAllEvents,
	getEventById,
} from "../../controllers/event.controller";

import { protect } from "../../middleware/auth.middleware";
import { getEventAnalytics } from "../../controllers/event.controller";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", protect, createEvent);
router.get("/:id/analytics", protect, getEventAnalytics);

export default router;
