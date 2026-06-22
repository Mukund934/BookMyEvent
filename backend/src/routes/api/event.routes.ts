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

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of all events
 */

router.get("/", getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 */

router.get("/:id", getEventById);

/**
 * @swagger
 * /events/create:
 *   post:
 *     summary: Create new event
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Event created successfully
 */

router.post("/create", protect, validate(createEventSchema), createEvent);

/**
 * @swagger
 * /events/{id}/analytics:
 *   get:
 *     summary: Get event analytics
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event analytics data
 */

router.get("/:id/analytics", protect, getEventAnalytics);

export default router;
