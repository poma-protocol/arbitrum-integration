import { db } from "../db/pool";
import { jackpotActivity } from "../db/schema";
import { Errors, MyError } from "../helpers/errors";
import { CreateJackpot } from "../helpers/types";

export class Database {
    async storeJackpot(args: CreateJackpot) {
        try {
            await db.insert(jackpotActivity).values({
                challenge_id: args.challenge_id,
                requirement: args.requirement,
                startDate: args.startDate,
                endDate: args.endDate,
                reward: args.reward
            });
        } catch(err) {
            console.log("Could not store jackpot activity =>", err);
            throw new MyError(Errors.NOT_STORE_JACKPOT);
        }
    }
}
const database = new Database();
export default database;