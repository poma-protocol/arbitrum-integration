import { and, count, eq } from "drizzle-orm";
import { db } from "../db/pool";
import { activityPlayers, games, jackpotActivity, jackpotFoundTransactions, jackpotPlayers, type1Activities, type1Challenges } from "../db/schema";
import { Errors, MyError } from "../helpers/errors";
import { CreateChallengeType, CreateJackpot } from "../helpers/types";
import { MilestonePlayers } from "../controller/battle/get_players";

interface Activity {
    id: number,
    name: string,
    reward: number | null,
    goal: number,
    image: string,
    startDate: string,
    endDate: string
}

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

    async doesGameIDExist(gameID: number): Promise<boolean> {
        try {
            const res = await db.select({
                id: games.id
            }).from(games)
            .where(eq(games.id, gameID));

            return res.length > 0;
        } catch(err) {
            console.log("Error checking if contract exists", err);
            throw new MyError(Errors.NOT_CHECK_CONTRACT_EXISTS);
        }
    }

    async createChallenge(args: CreateChallengeType): Promise<number> {
        try {
            const inserted = await db.insert(type1Challenges).values({
                name: args.name,
                gameID: args.gameID,
                functionName: args.function_name,
                playerAddressVariable: args.player_address_variable,
                contarct_address: args.contract_address,
                abi: args.abi,
                useForwarder: args.useForwarder,
                forwarderABI: args.forwarderABI,
                forwarderAddress: args.forwarderAddress
            }).returning({id: type1Challenges.id});

            return inserted[0].id;
        } catch(err) {
            console.log("Could not add challenge to DB", err);
            throw new MyError(Errors.NOT_CREATE_CHALLENGE_DB);
        }
    }

    async getBattlesFromGame(gameID: number): Promise<Activity[]> {
        try {
            const challenges = await db.select({
                id: type1Challenges.id
            }).from(type1Challenges)
            .where(eq(type1Challenges.gameID, gameID));

            const activities: Activity[] = []

            for (let challenge of challenges) {
                const activity = await db.select({
                    id: type1Activities.id,
                    name: type1Activities.name,
                    reward: type1Activities.reward,
                    goal: type1Activities.goal,
                    image: type1Activities.image,
                    startDate: type1Activities.startDate,
                    endDate: type1Activities.endDate
                }).from(type1Activities)
                .where(eq(type1Activities.challenge_id, challenge.id));

                activities.push(...activity);
            }

            return activities;
        } catch(err) {
            console.log("Error getting activities from game", err);
            throw new MyError(Errors.NOT_GET_ACTIVITIES_FROM_GAME);
        }
    }

    async getExistingMilestonePlayers(id: number): Promise<MilestonePlayers> {
        try {
            const players = await db.select({
                player: activityPlayers.playerAddress
            }).from(activityPlayers)
            .where(eq(activityPlayers.activityId, id));

            const rewarded_players = await db.select({
                player: activityPlayers.playerAddress
            }).from(activityPlayers)
            .where(and(eq(activityPlayers.activityId, id), eq(activityPlayers.done, true)));

            return {
                players: players.map((i) => i.player),
                rewarded_players: rewarded_players.map((i) => i.player)
            }
        } catch(err) {
            throw new MyError(Errors.NOT_GET_MILESTONE_PLAYERS);
        }
    }
}
const database = new MyDatabase();
export default database;