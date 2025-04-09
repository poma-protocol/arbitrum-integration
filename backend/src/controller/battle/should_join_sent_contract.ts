import { eq } from "drizzle-orm";
import { db } from "../../db/pool";
import { type1Activities } from "../../db/schema";
import { Errors, MyError } from "../../helpers/errors";

export default async function shouldUserJoinBeSentToContract(existing_milestone_id: number): Promise<boolean> {
    try {
        const reward = await db.select({
            reward: type1Activities.reward
        }).from(type1Activities)
        .where(eq(type1Activities.id, existing_milestone_id));

        // It should if activity has reward meaning its in contract
        if (reward[0]?.reward) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        console.log("Error checking if contract should be informed of user join", err);
        throw new MyError(Errors.NOT_CHECK_IF_CONTRACT_INFORMED_JOIN);
    }
}