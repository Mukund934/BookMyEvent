import { Router } from "express";
import User from "../../models/User";

const router = Router();

router.get("/", async (_, res) => {
	const user = await User.create({
		name: "Mukund",
		email: `mukund${Date.now()}@test.com`,
		password: "123456"
	});

	res.json(user);
});

export default router;