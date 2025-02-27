import app from "./app";
import "dotenv/config";
import { Errors, MyError } from "./helpers/errors";

const port = process.env.PORT;
if(!port) {
    console.log("Set Port To Run Server In ENV file!")
    throw new MyError(Errors.SERVER_SETUP);
}

app.get("/test", (req, res) => {
    res.send("Reachable");
})

app.all("*", (req, res) => {
    res.status(404).json({error: [Errors.ROUTE_NOT_FOUND]});
});

app.listen(port, () => {
    console.log(`Server listening on ${port}...`)
})