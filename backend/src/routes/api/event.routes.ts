import { Router } from "express";

import {createEvent,getAllEvents,getEventById} from "../../controllers/event.controller";

import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", protect, createEvent);

export default router;