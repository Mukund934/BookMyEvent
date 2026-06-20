import { Router } from "express";

import { protect } from "../../middleware/auth.middleware";
import { protectedRoute } from "../../controllers/test.controller";

const router = Router();

router.get("/", protect, protectedRoute);

export default router;