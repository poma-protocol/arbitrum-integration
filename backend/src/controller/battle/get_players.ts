import { MyDatabase } from "../../database"
import { Errors, MyError } from "../../helpers/errors";

export interface MilestonePlayers {
    players: string[],
    rewarded_players: string[]
}

export default async function getMilestonePlayers(id: number, db: MyDatabase): Promise<MilestonePlayers> {
    try {
        const doesMilestoneExist = await db.doesBattleExist(id);
        if (!doesMilestoneExist) {
            throw new MyError(Errors.MILESTONE_NOT_EXIST);
        }

        const players = await db.getExistingMilestonePlayers(id);
        return players;
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.MILESTONE_NOT_EXIST) {
                throw err;
            }
        }

        throw new MyError(Errors.NOT_GET_MILESTONE_PLAYERS);
    }
}