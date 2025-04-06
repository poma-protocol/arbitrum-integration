import { MyDatabase } from "../../database";
import { Errors, MyError } from "../../helpers/errors";

interface BattleStatistics {
    id: number,
    reward_given: number,
    no_players: number
}

export async function getBattleStatistics(battle_id: number, db: MyDatabase): Promise<BattleStatistics> {
    try {
        const exists = await db.doesBattleExist(battle_id);
        if (!exists) {
            throw new MyError(Errors.MILESTONE_NOT_EXIST);
        }

        const no_players = await db.getNumberOfBattlePlayers(battle_id);
        const reward_given = await db.getExistingBattleRewardGiven(battle_id);

        return {id: 1, reward_given, no_players};
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.MILESTONE_NOT_EXIST) {
                throw err;
            } 
        }

        console.log("Error getting battle statistics =>", err);
        throw new MyError(Errors.NOT_GET_BATTLE_STATISTICS);
    }
}