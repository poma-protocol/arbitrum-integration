import { Router } from "express"
const router: Router = Router();
import { authController } from "../controller/auth/auth";
import { UserSchema } from "../types";
import { MyError } from "../helpers/errors";
router.post("/register", async (req, res) => {
    try {
        const parsed = UserSchema.safeParse(req.body);
        if (parsed.success) {
            const args = parsed.data;
            const response = await authController.register(args);
            res.status(201).json(response);
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        if (err instanceof MyError) {
            throw new MyError(err.message);
        }
        console.error("Error registering user", err);
        res.status(500).json({ error: ["Error registering user"] });
    }
});
router.post("/login", async (req, res) => {
    try {
        const parsed = UserSchema.safeParse(req.body);
        if (parsed.success) {
            const args = parsed.data;
            const response = await authController.login(args);
            res.status(200).json(response);
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        console.error("Error logging in user", err);
        if (err instanceof MyError) {
            res.status(400).json({ error: [err.message] });
            return;
        }
        res.status(500).json({ error: ["Error logging in user"] });
    }
});
export default router;