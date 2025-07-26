import { and, count, eq, is, isNotNull, sql } from "drizzle-orm";
import { db } from "../db/pool";
import { activityPlayers, games, type1Activities, type1Challenges } from "../db/schema";
import { FilterGames } from "../helpers/types";

export interface RawGameDetails {
    id: number,
    name: string,
    category: string,
    image: string,
    challenges: number,
    activeBattles: number,
    totalPlayers: number,
    createdAt: Date
}

interface RawGameChallenges {
    id: number,
    name: string,
    function_name: string,
    player_address_variable: string,
    countItems: boolean,
    battles: number
}

interface RawGame {
    name: string,
    image: string,
    category: string,
    createdAt: Date
}

export class GamesModel {
    async filter(args: FilterGames): Promise<RawGameDetails[]> {
        try {
            console.log("Filtering Games with args", args);
            const results = await db.select({
                id: games.id,
                name: games.name,
                category: games.category,
                image: games.image,
                createdAt: games.createdAt,
                adminId: games.adminId
            }).from(games)
                .where(
                    sql`
                    (${args.category ?? null}::text IS NULL OR ${games.category} = ${args.category ?? null})
                    AND (${args.search ?? null}::text IS NULL OR ${games.name} LIKE ${args.search ?? null})
                     AND (${games.adminId} = ${args.adminId})
                `
                );

            let challengeNum = 0;
            let battleNum = 0;
            let totalPlayers = 0;
            let rawGames: RawGameDetails[] = [];

            for await (const g of results) {
                const challenges = await db.select({
                    id: type1Challenges.id
                }).from(type1Challenges)
                .where(eq(type1Challenges.gameID, g.id));
                challengeNum = challenges.length;

                for await (const c of challenges) {
                    const battles = await db.select({
                        id: type1Activities.id
                    }).from(type1Activities)
                    .where(and(isNotNull(type1Activities.creation_tx_hash), isNotNull(type1Activities.rewardTxn)))

                    battleNum = battles.length;
                    for await (const b of battles) {
                        const players = await db.select({
                            count: count(activityPlayers),
                        }).from(activityPlayers)
                        .where(eq(activityPlayers.activityId, b.id));

                        totalPlayers += players[0].count;
                    }
                }

                rawGames.push({...g, totalPlayers, challenges: challengeNum, activeBattles: battleNum});
            }


            
            console.log("Gotten games =>", results);
            return rawGames;
        } catch (err) {
            console.error("Error filtering games", err);
            throw new Error("Error filtering games");
        }
    }

    async getChallenges(id: number): Promise<RawGameChallenges[]> {
        try {
            const res = await db.select({
                id: type1Challenges.id,
                name: type1Challenges.name,
                function_name: type1Challenges.functionName,
                player_address_variable: type1Challenges.playerAddressVariable,
                countItems: type1Challenges.countItems
            }).from(type1Challenges)
            .innerJoin(games, eq(games.id, type1Challenges.gameID))
            .where(eq(games.id, id));

            const rawGameChallenges: RawGameChallenges[] = [];

            for await (const r of res) {
                const battles = await db.select({
                    count: type1Activities.id
                }).from(type1Activities)
                .where(eq(type1Activities.challenge_id, r.id));

                rawGameChallenges.push({...r, battles: battles.length});
            }

            return rawGameChallenges;
        } catch (err) {
            console.error("Error getting game challenges", err);
            throw new Error("Error getting game challenges");
        }
    }

    async getGamesByAdmin(adminId: number): Promise<RawGameDetails[]> {
        try {
            const results = await db.select({
                id: games.id,
                name: games.name,
                category: games.category,
                image: games.image,
                challenges: count(type1Challenges),
                activeBattles: count(type1Activities),
                totalPlayers: count(activityPlayers),
                createdAt: games.createdAt
            }).from(games)
                .innerJoin(type1Challenges, eq(type1Challenges.gameID, games.id))
                .innerJoin(type1Activities, eq(type1Activities.challenge_id, type1Challenges.id))
                .innerJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .where(eq(games.adminId, adminId))
                .groupBy(activityPlayers.playerAddress, type1Activities.id, type1Challenges.id, games.id);

            return results;
        } catch (err) {
            console.error("Error getting games by admin", err);
            throw new Error("Error getting games by admin");
        }
    }

    async get(id: number): Promise<RawGame | null> {
        try {
            const res = await db.select({
                name: games.name,
                category: games.category,
                createdAt: games.createdAt,
                image: games.image
            }).from(games)
            .where(eq(games.id, id));

            return res[0] ?? null;
        } catch(err) {
            console.error("Error getting game from id", err);
            throw new Error("Error getting game");
        }
    }
}

const gamesModel = new GamesModel();
export default gamesModel;