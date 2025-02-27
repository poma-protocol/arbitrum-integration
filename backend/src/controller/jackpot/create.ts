import { MyDatabase } from "../../database";
import { Errors, MyError } from "../../helpers/errors";
import { CreateJackpot } from "../../helpers/types";

export async function createJackpot(args: CreateJackpot, database: MyDatabase) {
    try {
        // Store details in DB
        await database.storeJackpot(args);
        // TODO: Maybe store in contract
    } catch(err) {
        console.log("Error creating jackpot activity =>", err);
        throw new MyError(Errors.NOT_CREATE_JACKPOT);
    }
}