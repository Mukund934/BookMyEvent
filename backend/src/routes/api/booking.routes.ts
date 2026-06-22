import { Router } from "express";

import { protect } from "../../middleware/auth.middleware";
import { bookEvent, getMyBookings } from "../../controllers/booking.controller";
import { cancelBooking } from "../../controllers/booking.controller";
const router = Router();


/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book seats for an event
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - seats
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 63a123456789abcdef123456
 *               seats:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking created successfully
 */


router.post("/", protect, bookEvent);


/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User bookings
 */

router.get("/my-bookings", protect, getMyBookings);

/**
 * @swagger
 * /bookings/{bookingId}:
 *   delete:
 *     summary: Cancel booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */


router.delete("/:bookingId", protect, cancelBooking);

export default router;
