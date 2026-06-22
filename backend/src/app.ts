import express from "express";
import cors from "cors";

import routes from "./routes";
import errorMiddleware from "./middleware/error.middleware";
import { securityMiddleware } from "./middleware/security.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL || "*",
		credentials: true,
	}),
);

app.use(express.json());

securityMiddleware.forEach((middleware) => {
	app.use(middleware);
});

app.get("/", (_, res) => {
	res.json({
		success: true,
		message: "BookMyEvent API Running"
	});
});

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec),
);

app.use("/api", routes);

app.use(errorMiddleware);

export default app;