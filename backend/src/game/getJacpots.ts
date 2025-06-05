import { db } from "../db/pool";
import {eq, sql, and, count} from "drizzle-orm";
import { games, jackpotActivity, jackpotFoundTransactions, jackpotPlayers, type1Challenges } from "../db/schema";
import { Errors, MyError } from "../helpers/errors";

export interface Jackpot {
    id: number,
    address: string,
    playerAddressVariable: string,
    functionName: string,
    requirement: number,
    players: string[],
    found: Record<string, number>,
    abi: JSON,
    endDate: Date
}

export async function getJackpots(): Promise<Jackpot[]> {
    try {
        let toReturn: Jackpot[] = [];
        
        // Get all games
        const retrievedGames = await db.select({
            id: games.id,
        }).from(games);

        for (let game of retrievedGames) {
            // Get challenges
            const challenges = await db.select({
                id: type1Challenges.id,
                address: type1Challenges.contarct_address,
                abi: type1Challenges.abi,
                functionName: type1Challenges.functionName,
                playerAddressVariable: type1Challenges.playerAddressVariable
            }).from(type1Challenges)
                .where(eq(type1Challenges.gameID, game.id));

            for (let challenge of challenges) {
                // Get jackpots for a challenge
                const jackpots = await db.select({
                    id: jackpotActivity.id,
                    requirement: jackpotActivity.requirement,
                    endDate: jackpotActivity.endDate
                }).from(jackpotActivity)
                .where(sql`${jackpotActivity.playerAwarded} = false AND ${jackpotActivity.challenge_id} = ${challenge.id} AND ${jackpotActivity.startDate} < now()`);

                for (let jackpot of jackpots) {
                    // Getting players
                    const players = await db.select({
                        playerAddress: jackpotPlayers.playerAddress
                    }).from(jackpotPlayers)
                    .where(and(
                        eq(jackpotPlayers.met_requirement, false),
                        eq(jackpotPlayers.jackpot_id, jackpot.id)
                    ));

                    const playersToReturn = players.map((p) => p.playerAddress);

                    let found: Record<string, number> = {}
                    // Get found
                    for (let player of players) {
                        const res = await db.select({
                            count: count(),
                        }).from(jackpotFoundTransactions)
                        .where(and(
                            eq(jackpotFoundTransactions.jackpot_id, jackpot.id),
                            eq(jackpotPlayers.playerAddress, player.playerAddress)
                        ));

                        found[player.playerAddress] = res[0].count
                    }

                    toReturn.push({
                        id: jackpot.id,
                        address: challenge.address,
                        playerAddressVariable: challenge.playerAddressVariable,
                        functionName: challenge.functionName,
                        requirement: jackpot.requirement,
                        players: playersToReturn,
                        found,
                        //@ts-ignore
                        abi: challenge.abi,
                        endDate: new Date(Date.parse(jackpot.endDate))
                    })
                }
            }
        }

        return toReturn;
    } catch(err) {
        console.log("Could not get jackpots =>", err);
        throw new MyError(Errors.NOT_GET_JACKPOTS);
    }
}