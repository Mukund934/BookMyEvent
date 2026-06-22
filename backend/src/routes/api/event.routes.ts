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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - price
 *               - totalSeats
 *             properties:
 *               title:
 *                 type: string
 *                 example: React Summit 2026
 *               description:
 *                 type: string
 *                 example: Frontend Conference
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *                 example: Raipur
 *               price:
 *                 type: number
 *                 example: 499
 *               totalSeats:
 *                 type: number
 *                 example: 100
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
