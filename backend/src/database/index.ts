import { and, count, eq } from "drizzle-orm";
import { db } from "../db/pool";
import { activityPlayers, contracts, jackpotActivity, jackpotFoundTransactions, jackpotPlayers, type1Activities } from "../db/schema";
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

    async isPlayerInBattle(id: number, player_address: string): Promise<boolean> {
        try {
            const res = await db.select({
                id: activityPlayers.activityId
            }).from(activityPlayers)
            .where(and(
                eq(activityPlayers.activityId, id),
                eq(activityPlayers.playerAddress, player_address)
            ));

            return res.length > 0;
        } catch(err) {
            console.log("Could not check if player already in battle", err);
            throw new MyError(Errors.NOT_CHECK_PLAYER_IN_BATTLE);
        }
    }

    async markJackpotAsCompleted(id: number) {
        try {
            // Update the player rewarded variable
            await db.update(jackpotActivity).set({
                playerAwarded: true
            }).where(eq(jackpotActivity.id, id));
        } catch(err) {
            console.log("Error marking jackpot as complete", err);
            throw new MyError(Errors.NOT_MARK_JACKPOT_DONE);
        }
    }

    async markJackpotPlayerFound(jackpot_id: number, player_address: string, txHash: string) {
        try {
            await db.insert(jackpotFoundTransactions).values({
                jackpot_id,
                playerAddress: player_address,
                txHash
            });
        } catch(err) {
            console.log("Could not mark jackpot player as found", err);
            throw new MyError(Errors.NOT_MARK_JACKPOT_PLAYER_FOUND);
        }
    }

    async enterPlayerInRaffle(jackpot_id: number, player_address: string) {
        try {
            await db.update(jackpotPlayers).set({
                met_requirement: true
            }).where(eq(jackpotPlayers.jackpot_id, jackpot_id));
        } catch(err) {
            console.log("Could not enter player in raffle", err);
            throw new MyError(Errors.NOT_ENTER_PLAYER_RAFFLE);
        }
    }

    async doesJackpotExist(jackpot_id: number): Promise<boolean> {
        try {
            const res = await db.select({
                id: jackpotActivity.id
            }).from(jackpotActivity)
            .where(eq(jackpotActivity.id, jackpot_id));

            return res.length > 0;
        } catch(err) {
            console.log("Error checking if jackpot exists", err);
            throw new MyError(Errors.NOT_CHECK_JACKPOT_EXISTS);
        }
    }

    async addPlayerToJackpot(jackpot_id: number, player_address: string) {
        try {
            await db.insert(jackpotPlayers).values({
                jackpot_id,
                playerAddress: player_address
            });
        } catch(err) {
            console.log("Error adding player to jackpot", err);
            throw new MyError(Errors.NOT_ADD_JACKPOT_PLAYER_DB);
        }
    }

    async isPlayerInJackpot(jackpot_id: number, player_address: string): Promise<boolean> {
        try {
            const res = await db.select({
                id: jackpotPlayers.jackpot_id
            }).from(jackpotPlayers)
            .where(and(
                eq(jackpotPlayers.jackpot_id, jackpot_id),
                eq(jackpotPlayers.playerAddress, player_address)
            ));

            return res.length > 0;
        } catch(err) {
            console.log("Error checking if player is in jackpot", err);
            throw new MyError(Errors.NOT_CHECK_PLAYER_IN_JACKPOT);
        }
    }

    async doesContractIDExist(contract_id: number): Promise<boolean> {
        try {
            const res = await db.select({
                id: contracts.id
            }).from(contracts)
            .where(eq(contracts.id, contract_id));

            return res.length > 0;
        } catch(err) {
            console.log("Error checking if contract exists", err);
            throw new MyError(Errors.NOT_CHECK_CONTRACT_EXISTS);
        }
    }
}
const database = new MyDatabase();
export default database;