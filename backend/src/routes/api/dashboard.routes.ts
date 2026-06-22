import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";

import {
	getDashboardOverview,
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
} from "../../controllers/dashboard.controller";

const router = Router();


/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Dashboard overview
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics
 */


router.get("/overview", protect, getDashboardOverview);

router.get("/top-events", protect, getTopEventsByRevenue);
router.get("/trends", protect, getMonthlyBookingTrends);

router.get("/cancellations", protect, getCancellationStats);
router.get("/heatmap", protect, getLocationHeatmap);

export default router;
