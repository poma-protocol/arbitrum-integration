import Express from "express";
import router from "./routes";

const app = Express();
app.use("/", Express.json());
app.use("/game", router.game);
app.use("/activity", router.activity)

export default app;