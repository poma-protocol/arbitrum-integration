import { MyDatabase } from "../database";
import { Errors, MyError } from "../helpers/errors";
import { CreateChallenge } from "../helpers/types";

export async function createChallenge(args: CreateChallenge, db: MyDatabase) {
    try {   
        // Throw error if contract does not exist
        const doesContractExist = await db.doesContractIDExist(args.contractID);
        if (!doesContractExist) {
            throw new MyError(Errors.CONTRACT_NOT_EXIST);
        }

        // Create challenge
        await db.createChallenge(args);
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.CONTRACT_NOT_EXIST) {
                throw err;
            }
        }

        console.log("Error creating challenges =>", err);
        throw new MyError(Errors.NOT_CREATE_CHALLENGE);
    }
}