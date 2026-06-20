import { Router } from "express";

import { createEvent } from "../../controllers/event.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createEvent);

export default router;