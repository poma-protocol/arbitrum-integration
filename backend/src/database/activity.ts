import { and, count, desc, not, or, sql } from "drizzle-orm";

import { db } from "../db/pool";
import { activityPlayers, games, playerOperatorWalletTable, type1Activities, type1Challenges } from "../db/schema";
import { eq } from "drizzle-orm";
import { FilteredActivity, StoreOperatorWallet } from "../helpers/types";

export interface RawDealCardDetails {
    id: number;
    name: string;
    image: string;
    reward: number;
    playerCount: number;
    maxPlayers: number;
    startDate: Date;
    endDate: Date;
    players: string[]
}

const PAGE_SIZE = 6;

enum RewardFilter {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

const LOW_REWARD = 0.00001;
const MEDIUM_REWARD = 0.0001;
const HIGH_REWARD = 0.001;

export enum ActivityStatus {
    UPCOMING = "upcoming",
    COMPLETED = "completed",
    ACTIVE = "active"
}

interface StoreOperatorWalletArgs {
    gameid: number,
    useraddress: string,
    operatoraddress: string
}

export class ActivityModel {
    private async _getActivityPlayers(activityID: number): Promise<string[]> {
        try {
            const playersDB = await db.select({
                address: activityPlayers.playerAddress
            }).from(activityPlayers)
            .where(eq(activityPlayers.activityId, activityID));

            const players: string[] = [];
            
            for (const p of playersDB) {
                players.push(p.address);
            }

            return players;
        } catch(err) {
            console.error("Error getting activity players", err);
            throw new Error("Error getting activity players");
        }
    }

    async getFeaturedActivities(): Promise<RawDealCardDetails[]> {
        try {
            const rawActivities = await db.select({
                id: type1Activities.id,
                name: type1Activities.name,
                image: type1Activities.image,
                reward: type1Activities.reward,
                playerCount: count(activityPlayers),
                maxPlayers: type1Activities.maximum_number_players,
                startDate: type1Activities.startDate,
                endDate: type1Activities.endDate
            }).from(type1Activities)
                .leftJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .where(eq(type1Activities.done, false))
                .orderBy(desc(type1Activities.reward))
                .groupBy(type1Activities.id, activityPlayers.activityId)
                .limit(3)

            const activities: RawDealCardDetails[] = [];

            for await (const r of rawActivities) {
                const players = await this._getActivityPlayers(r.id);
                activities.push({...r, players});
            }

            return activities;
        } catch (err) {
            console.error("Error getting featured deals from database", err);
            throw new Error("Error getting featured deals from database");
        }
    }

    async filterMilestones(args: FilteredActivity): Promise<RawDealCardDetails[]> {
        console.log("Filtering activities with args", args);
        try {
            let minimumReward: number = 0;
            if (args.rewards) {
                if (args.rewards === RewardFilter.LOW) {
                    minimumReward = LOW_REWARD;
                } else if (args.rewards === RewardFilter.MEDIUM) {
                    minimumReward = MEDIUM_REWARD;
                } else {
                    minimumReward = HIGH_REWARD;
                }
            }

            const today = new Date();

            const rawActivities = await db.select({
                id: type1Activities.id,
                name: type1Activities.name,
                image: type1Activities.image,
                reward: type1Activities.reward,
                playerCount: count(activityPlayers),
                maxPlayers: type1Activities.maximum_number_players,
                startDate: type1Activities.startDate,
                endDate: type1Activities.endDate
            }).from(type1Activities)
                .leftJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .innerJoin(type1Challenges, eq(type1Activities.challenge_id, type1Challenges.id))
                .innerJoin(games, eq(type1Challenges.gameID, games.id))
                .where(
                    sql`
                    ${args.category ?? null}::text IS NULL OR ${games.category} = ${args.category ?? null}
                    AND (${args.game ?? null}::text IS NULL OR ${games.name} = ${args.game ?? null})
                    AND (${args.rewards ?? null}::text IS NULL OR ${type1Activities.reward} >= ${minimumReward})
                    AND (${args.status ?? null}::text IS NULL OR ${args.status ?? null} = ${ActivityStatus.ACTIVE} AND ${type1Activities.startDate} < ${today} AND ${type1Activities.endDate} > ${today} OR ${args.status ?? null} = ${ActivityStatus.COMPLETED} AND ${type1Activities.endDate} < ${today} OR ${args.status ?? null} = ${ActivityStatus.UPCOMING} AND ${type1Activities.startDate} > ${today})
                    AND(${args.search ?? null}::text IS NULL OR (${type1Activities.name} LIKE ${args.search ?? null} OR ${games.name} LIKE ${args.search ?? null} OR ${type1Challenges.name} LIKE ${args.status ?? null}))
                    AND ${type1Activities.done} = false
                    AND (${args.adminId ?? null}::integer IS NULL OR ${games.adminId} = ${args.adminId ?? null})
                `,
                )
                .orderBy(desc(type1Activities.reward))
                .groupBy(type1Activities.id, activityPlayers.activityId)
                .offset((args.page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE);

            const activities: RawDealCardDetails[] = [];
            for await (const r of rawActivities) {
                const players = await this._getActivityPlayers(r.id);
                activities.push({...r, players});
            }

            return activities;
        } catch (err) {
            console.error("Error filtering milestone activities", err);
            throw new Error("Could not filter milestone activities");
        }
    }

    async isOperatorAddressUsedByOtherPlayer(operatorAddress: string, playerAddress: string): Promise<boolean> {
        try {
            const res = await db.select({
                operatorAddress: playerOperatorWalletTable.operatorAddress
            }).from(playerOperatorWalletTable)
                .where(and(eq(playerOperatorWalletTable.operatorAddress, operatorAddress.toLowerCase()), not(eq(playerOperatorWalletTable.userAddress, playerAddress.toLowerCase()))));

            return res.length > 0;
        } catch (err) {
            console.log("Error checking if operator address is being used by other player", err);
            throw new Error("Could not check if operator address used by other player");
        }
    }

    async isOperatorAddressAlreadyStored(userAddress: string, operatorAddress: string): Promise<boolean> {
        try {
            const res = await db.select({
                operatorAddress: playerOperatorWalletTable.userAddress
            }).from(playerOperatorWalletTable)
                .where(and(eq(playerOperatorWalletTable.operatorAddress, operatorAddress.toLowerCase()), eq(playerOperatorWalletTable.userAddress, userAddress.toLowerCase())));

            return res.length > 0;
        } catch (err) {
            console.error("Error checking if operator address has already been stored", err);
            throw new Error("Could not check if operator address has already been stored");
        }
    }

    async storeOperatorWallet(args: StoreOperatorWalletArgs) {
        try {
            await db.insert(playerOperatorWalletTable).values({
                userAddress: args.useraddress.toLowerCase(),
                operatorAddress: args.operatoraddress.toLowerCase(),
                gameID: args.gameid
            });
        } catch (err) {
            console.error("Error storing operator wallet", err);
            throw new Error("Error storing operator wallet");
        }
    }

    async getOperatorWallet(userAddress: string, activityID: number): Promise<string | null> {
        try {
            const res = await db.select({
                operatorAddress: playerOperatorWalletTable.operatorAddress
            }).from(playerOperatorWalletTable)
                .innerJoin(type1Challenges, eq(type1Challenges.gameID, playerOperatorWalletTable.gameID))
                .innerJoin(type1Activities, eq(type1Activities.challenge_id, type1Challenges.id))
                .where(and(eq(playerOperatorWalletTable.userAddress, userAddress.toLowerCase()), eq(type1Activities.id, activityID)));

            return res[0]?.operatorAddress;
        } catch (err) {
            console.log("Error getting operator wallet of user", err);
            throw new Error("Could not get operator address of user");
        }
    }

    async getGameID(activityID: number): Promise<number | null> {
        try {
            const res = await db.select({
                id: games.id
            }).from(games)
                .innerJoin(type1Challenges, eq(type1Challenges.gameID, games.id))
                .innerJoin(type1Activities, eq(type1Activities.challenge_id, type1Challenges.id))
                .where(eq(type1Activities.id, activityID));

            return res[0]?.id;
        } catch (err) {
            console.error("Error getting game ID", err);
            throw new Error("Error getting game ID");
        }
    }

    async getUserBattles(userAddress: string): Promise<RawDealCardDetails[]> {
        try {
            const rawBattles = await db.select({
                id: type1Activities.id,
                name: type1Activities.name,
                image: type1Activities.image,
                reward: type1Activities.reward,
                playerCount: count(activityPlayers),
                maxPlayers: type1Activities.maximum_number_players,
                startDate: type1Activities.startDate,
                endDate: type1Activities.endDate,
                userDone: sql<boolean>`bool_or(${activityPlayers.done})`, // or max() if you prefer
                battleDone: type1Activities.done
            }).from(type1Activities)
                .leftJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .where(eq(activityPlayers.playerAddress, userAddress.toLowerCase()))
                .groupBy(type1Activities.id, type1Activities.done);

            const activities: RawDealCardDetails[] = [];
            for await (const r of rawBattles) {
                const players = await this._getActivityPlayers(r.id);
                activities.push({...r, players});
            }

            return activities;
        } catch (err) {
            console.error("Error getting user's battles", err);
            throw new Error("Error getting user's battles");
        }
    }

    async getActivitiesByAdmin(adminId: number): Promise<RawDealCardDetails[]> {
        try {
            const rawActivities = await db.select({
                id: type1Activities.id,
                name: type1Activities.name,
                image: type1Activities.image,
                reward: type1Activities.reward,
                playerCount: count(activityPlayers),
                maxPlayers: type1Activities.maximum_number_players,
                startDate: type1Activities.startDate,
                endDate: type1Activities.endDate
            }).from(type1Activities)
                .leftJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .innerJoin(type1Challenges, eq(type1Challenges.id, type1Activities.challenge_id))
                .innerJoin(games, eq(games.id, type1Challenges.gameID))
                .where(eq(games.adminId, adminId))
                .groupBy(type1Activities.id, activityPlayers.activityId);

            const activities: RawDealCardDetails[] = [];
            for await (const r of rawActivities) {
                const players = await this._getActivityPlayers(r.id);
                activities.push({...r, players});
            }

            return activities;
        } catch (err) {
            console.error("Error getting activities by admin", err);
            throw new Error("Error getting activities by admin");
        }
    }

    async hasTransactionBeenUsed(txn: string): Promise<boolean> {
        try {
            const res = await db.select({
                id: type1Activities.id
            }).from(type1Activities)
            .where(or(eq(type1Activities.rewardTxn, txn), eq(type1Activities.commissionTxn, txn)));

            return res.length > 0;
        } catch(err) {
            console.error("Error checking if transaction hash has been used before", err);
            throw new Error("Error checking if transaction has been used before");
        }
    }

    async storeCommissionTxn(activityID: number, txn: string) {
        try {
            await db.update(type1Activities).set({
                commissionTxn: txn
            }).where(eq(type1Activities.id, activityID));
        } catch(err) {
            console.error("Error storing commission txn", err);
            throw new Error("Error storing commission txn");
        }
    }

    async storeRewardTxn(activityID: number, txn: string) {
        try {
            await db.update(type1Activities).set({
                rewardTxn: txn 
            }).where(eq(type1Activities.id, activityID));
        } catch(err) {
            console.error("Error storing reward txn", err);
            throw new Error("Error storing reward txn");
        }
    }
}

const activityModel = new ActivityModel();
export default activityModel;