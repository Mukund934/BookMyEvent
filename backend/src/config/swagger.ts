import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "BookMyEvent API",
			version: "1.0.0",
			description: "Event Booking Platform API",
		},
		servers: [
			{
				url: "http://localhost:5000/api",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["src/routes/api/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);