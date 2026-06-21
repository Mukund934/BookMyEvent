import { Router } from "express";

import healthRoutes from "./api/health.routes";
import authRoutes from "./api/auth.routes";
import protectedRoutes from "./api/protected.routes";
import eventRoutes from "./api/event.routes";
import bookingRoutes from "./api/booking.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);
export default router;
