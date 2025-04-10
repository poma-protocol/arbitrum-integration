import { Errors, MyError } from "../helpers/errors";
import { db } from "../db/pool";
import { activityPlayers, contracts, type1Activities, type1Challenges, type1foundTransactions } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export interface Activity {
    id: number,
    address: string,
    playerAddressVariable: string,
    functionName: string,
    goal: number,
    players: {address: string, worx_id: string | null, operator: string | null}[],
    found: Record<string, number>,
    abi: JSON,
    reward: number | null
}

export async function getActivities(): Promise<Activity[]> {
    try {
        let toReturn: Activity[] = [];

        // Get all games
        const games = await db.select({
            id: contracts.id,
            address: contracts.address,
            abi: contracts.abi
        }).from(contracts);

        for (let game of games) {
            // Get challenges
            const challenges = await db.select({
                id: type1Challenges.id,
                functionName: type1Challenges.functionName,
                playerAddressVariable: type1Challenges.playerAddressVariable
            }).from(type1Challenges)
                .where(eq(type1Challenges.contractID, game.id));

            for (let challenge of challenges) {
                // Get activites
                const activities = await db.select({
                    id: type1Activities.id,
                    goal: type1Activities.goal,
                    reward: type1Activities.reward,
                }).from(type1Activities)
                    .where(sql`${type1Activities.done} = false AND ${type1Activities.challenge_id} = ${challenge.id} AND ${type1Activities.startDate} < now() AND ${type1Activities.endDate} > now()`)

                for (let activity of activities) {
                    // Get players
                    const players = await db.select({
                        playerAddress: activityPlayers.playerAddress,
                        worx_id: activityPlayers.bubbleID,
                        operator: activityPlayers.operator_address
                    }).from(activityPlayers)
                        .where(sql`${activityPlayers.done} = false AND ${activityPlayers.activityId} = ${activity.id}`);
                    
                    const playersToReturn = players.map((p) => {
                        return {
                            address: p.playerAddress, worx_id: p.worx_id, operator: p.operator
                        }
                    });

                    let found: Record<string, number> = {};
                    // Get found
                    for (let player of players) {
                        const count = await db.select({
                            count: sql<number>`cast(count(*) as int)`
                        }).from(type1foundTransactions)
                            .where(sql`${type1foundTransactions.activity_id} = ${activity.id} AND ${type1foundTransactions.playerAddress} = ${player.playerAddress}`);

                        found[player.operator ?? player.playerAddress] = count[0].count
                    }

                    toReturn.push({
                        id: activity.id,
                        address: game.address,
                        playerAddressVariable: challenge.playerAddressVariable,
                        functionName: challenge.functionName,
                        goal: activity.goal,
                        players: playersToReturn,
                        reward: activity.reward,
                        found,
                        //@ts-ignore
                        abi: game.abi
                    })
                }
            }
        }

        return toReturn;
    } catch (err) {
        console.log("Could Not Get Activities =>", err);
        throw new MyError(Errors.NOT_GET_ACTIVITIES);
    }
}