import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
	console.error("MONGO_URI is not defined in .env");
	process.exit(1);
}

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("MongoDB Connected Successfully ");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("MongoDB Connection Error:", error);
		process.exit(1);
	});