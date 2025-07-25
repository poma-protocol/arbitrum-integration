import { count, eq, sql } from "drizzle-orm";
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

export class GamesModel {
    async filter(args: FilterGames): Promise<RawGameDetails[]> {
        try {
            console.log("Filtering Games with args", args);
            const results = await db.select({
                id: games.id,
                name: games.name,
                category: games.category,
                image: games.image,
                challenges: count(type1Challenges),
                activeBattles: count(type1Activities),
                totalPlayers: count(activityPlayers),
                createdAt: games.createdAt,
                adminId: games.adminId
            }).from(games)
                .innerJoin(type1Challenges, eq(type1Challenges.gameID, games.id))
                .innerJoin(type1Activities, eq(type1Activities.challenge_id, type1Challenges.id))
                .innerJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
                .groupBy(activityPlayers.playerAddress, type1Activities.id, type1Challenges.id, games.id)
                .where(
                    sql`
                    (${args.category ?? null}::text IS NULL OR ${games.category} = ${args.category ?? null})
                    AND (${args.search ?? null}::text IS NULL OR ${games.name} LIKE ${args.search ?? null})
                     AND (${args.adminId ?? null}::integer IS NULL OR ${games.adminId} = ${args.adminId})
                `
                );
            console.log("Gotten games =>", results);
            return results;
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
}

const gamesModel = new GamesModel();
export default gamesModel;