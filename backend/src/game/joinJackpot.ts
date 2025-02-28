import { MyDatabase } from "../database";
import { Errors, MyError } from "../helpers/errors";

export async function joinJackpot(id: number, player_address: string, db: MyDatabase) {
    try {
        // Check that jackpot exists
        const exist = await db.doesJackpotExist(id);
        if (!exist) {
            throw new MyError(Errors.JACKPOT_NOT_EXIST);
        }

        // Check if player already joined jackpot
        const playerInJackpot = await db.isPlayerInJackpot(id, player_address);
        if (playerInJackpot) {
            throw new MyError(Errors.PLAYER_ALREADY_IN_JACKPOT);
        }
    
        // Add user to jackpot in DB
        await db.addPlayerToJackpot(id, player_address);

        // TODO: Determine if needs to be added in smart contract
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.JACKPOT_NOT_EXIST || err.message === Errors.PLAYER_ALREADY_IN_JACKPOT) {
                throw err;
            }
        }

        console.log("Could not join jackpot", err);
        throw new MyError(Errors.NOT_JOIN_JACKPOT);
    }
}