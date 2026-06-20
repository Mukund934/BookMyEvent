import { Router } from "express";

import healthRoutes from "./api/health.routes";
import authRoutes from "./api/auth.routes";
import protectedRoutes from "./api/protected.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);


export default router;