import app from "./app";
import "dotenv/config";
import { Errors, MyError } from "./helpers/errors";

const port = process.env.PORT;
if(!port) {
    console.log("Set Port To Run Server In ENV file!")
    throw new MyError(Errors.SERVER_SETUP);
}

app.listen(port, () => {
    console.log(`Server listening on ${port}...`)
})