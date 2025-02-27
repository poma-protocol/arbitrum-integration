import Express from "express";
import router from "./routes";
import cors from "cors";

const app: Express.Express = Express();
app.use("/", cors());
app.use("/", Express.json());
app.use("/game", router.game);
app.use("/activity", router.activity)

export default app;