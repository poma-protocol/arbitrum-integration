import { and, count, eq } from "drizzle-orm";
import { db } from "../db/pool";
import { activityPlayers, jackpotActivity, type1Activities } from "../db/schema";
import { Errors, MyError } from "../helpers/errors";
import { CreateJackpot } from "../helpers/types";

export class MyDatabase {
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

    async doesBattleExist(id: number): Promise<boolean> {
        try {
            const results = await db.select({
                id: type1Activities.id
            }).from(type1Activities)
            .where(eq(type1Activities.id, id));

            return results.length >= 1;
        } catch(err) {
            console.log("Could not check if battle exists =>", err);
            throw new MyError(Errors.NOT_CHECK_BATTLE_EXIST);
        }
    }

    async getNumberOfBattlePlayers(id: number): Promise<number> {
        try {
            const results = await db.select({
                count: count()
            }).from(activityPlayers)
            .where(eq(activityPlayers.activityId, id));

            return results[0].count;
        } catch(err) {
            console.log("Error getting number of battle players =>", err);
            throw new MyError(Errors.NOT_GET_NUMBER_BATTLE_PLAYERS);
        }
    }

    async getExistingBattleRewardGiven(id: number): Promise<number> {
        try {
            // Get activity reward
            const rewards = await db.select({
                reward: type1Activities.reward
            }).from(type1Activities)
            .where(eq(type1Activities.id, id));

            const reward = rewards[0].reward ?? 0;

            // Get number of players sent reward
            const numbers = await db.select({
                count: count()
            }).from(activityPlayers)
            .where(and(
                eq(activityPlayers.activityId, id),
                eq(activityPlayers.done, true)
            ));

            return reward * numbers[0].count
        } catch(err) {
            console.log("Could not get battle rewards given =>", err);
            throw new MyError(Errors.NOT_GET_BATTLE_REWARD_GIVEN);
        }
    }
}
const database = new MyDatabase();
export default database;