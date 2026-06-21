import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";

import {
	getTopEventsByRevenue,
	getMonthlyBookingTrends,
	getCancellationStats,
	getLocationHeatmap,
} from "../../controllers/dashboard.controller";

const router = Router();

router.get("/top-events", protect, getTopEventsByRevenue);
router.get("/trends", protect, getMonthlyBookingTrends);
router.get("/cancellations", protect, getCancellationStats);
router.get("/heatmap", protect, getLocationHeatmap);

export default router;