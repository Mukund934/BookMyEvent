import { Router } from "express";

import { protect } from "../../middleware/auth.middleware";
import { bookEvent } from "../../controllers/booking.controller";

const router = Router();

router.post("/", protect, bookEvent);

export default router;