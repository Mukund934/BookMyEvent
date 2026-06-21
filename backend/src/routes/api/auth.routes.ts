import { Router } from "express";
import { register, login } from "../../controllers/auth.controller";

import { authRateLimit } from "../../middleware/authRateLimit";

const router = Router();

router.post("/register", register);
router.post("/login", authRateLimit, login);
export default router;
