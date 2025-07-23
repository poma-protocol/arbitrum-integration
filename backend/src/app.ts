import Express from "express";
import router from "./routes";
import cors from "cors";
import { Errors } from "./helpers/errors";
import { loginSchema } from "./helpers/types";
import "dotenv/config";

const app: Express.Express = Express();
app.use("/", cors());
app.use("/", Express.json());
app.use("/game", router.game);
app.use("/activity", router.activity);
app.use("/jackpot", router.jackpot);
app.use("/auth", router.auth)
app.post("/login", async (req , res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            if (data.email === process.env.ADMIN_EMAIL && data.password === process.env.ADMIN_PASSWORD) {
                res.status(201).json({message: "Login succesful"});
            } else {
                res.status(401).json({message: "Invalid credentials"});
            }
        } else {
            const error = parsed.error.issues[0].message;
            res.status(400).json({message: error});
            return;
        }
    } catch(err) {
        console.error("Error logging in", err);
        res.status(500).json({message: Errors.INTERNAL_SERVER_ERROR});
    }
});

export default app;