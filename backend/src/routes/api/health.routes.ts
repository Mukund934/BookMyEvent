import { Router } from "express";
import { getHealthStatus } from "../../controllers/health.controller";

const router = Router();


/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API health status
 */


router.get("/", getHealthStatus);

export default router;