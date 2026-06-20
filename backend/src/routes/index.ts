import { Router } from "express";

import healthRoutes from "./api/health.routes";
import testRoutes from "./api/test.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/test", testRoutes);

export default router;