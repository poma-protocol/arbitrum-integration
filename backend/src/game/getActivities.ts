import { Errors, MyError } from "../helpers/errors";
import { db } from "../db/pool";
import { activityPlayers, games, type1Activities, type1Challenges, type1foundTransactions } from "../db/schema";
import { and, eq, gt, isNotNull, lt, sql } from "drizzle-orm";

export interface Activity {
    id: number,
    address: string,
    playerAddressVariable: string,
    functionName: string,
    goal: number,
    players: { address: string, worx_id: string | null, operator: string | null }[],
    found: Record<string, number>,
    abi: JSON,
    reward: number | null,
    forwarder?: {
        address: string,
        abi: JSON
    },
    methodDataAttributeName: string | null,
    wantedData: string | null,
    countItems: boolean | null,
    endDate: Date,
}

export async function getActivities(): Promise<Activity[]> {
    try {
        let toReturn: Activity[] = [];

        // Get all games
        const retrievedGames = await db.select({
            id: games.id,
        }).from(games);

        for (let game of retrievedGames) {
            // Get challenges
            const challenges = await db.select({
                id: type1Challenges.id,
                functionName: type1Challenges.functionName,
                playerAddressVariable: type1Challenges.playerAddressVariable,
                useForwarder: type1Challenges.useForwarder,
                forwarderAddress: type1Challenges.forwarderAddress,
                forwarderABI: type1Challenges.forwarderABI,
                methodDataAttributeName: type1Challenges.methodDataAttributeName,
                wantedData: type1Challenges.wantedData,
                countItems: type1Challenges.countItems,
                address: type1Challenges.contarct_address,
                abi: type1Challenges.abi
            }).from(type1Challenges)
                .where(eq(type1Challenges.gameID, game.id));

            for (let challenge of challenges) {
                // Get activites
                const activities = await db.select({
                    id: type1Activities.id,
                    goal: type1Activities.goal,
                    reward: type1Activities.reward,
                    endDate: type1Activities.endDate,
                }).from(type1Activities)
                    .where(and(eq(type1Activities.done, false), eq(type1Activities.challenge_id, challenge.id), lt(type1Activities.startDate, new Date()), isNotNull(type1Activities.rewardTxn), isNotNull(type1Activities.commissionTxn)))

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

                        found[player.operator?.toLocaleLowerCase() ?? player.playerAddress.toLocaleLowerCase()] = count[0].count
                    }
                    //check if it uses forwarder
                    const useForwarder = challenge.useForwarder;
                    if (useForwarder && challenge.forwarderABI && challenge.forwarderAddress) {
                        toReturn.push({
                            id: activity.id,
                            address: challenge.address,
                            playerAddressVariable: challenge.playerAddressVariable,
                            functionName: challenge.functionName,
                            goal: activity.goal,
                            players: playersToReturn,
                            reward: activity.reward,
                            found,
                            forwarder: {
                                address: challenge.forwarderAddress,
                                //@ts-ignore
                                abi: challenge.forwarderABI
                            },
                            abi: challenge.abi,
                            methodDataAttributeName: challenge.methodDataAttributeName,
                            wantedData: challenge.wantedData,
                            countItems: challenge.countItems,
                            endDate: activity.endDate
                        })
                    } else {
                        toReturn.push({
                            id: activity.id,
                            address: challenge.address,
                            playerAddressVariable: challenge.playerAddressVariable,
                            functionName: challenge.functionName,
                            goal: activity.goal,
                            players: playersToReturn,
                            reward: activity.reward,
                            found,
                            abi: challenge.abi,
                            methodDataAttributeName: challenge.methodDataAttributeName,
                            wantedData: challenge.wantedData,
                            countItems: challenge.countItems,
                            endDate: activity.endDate
                        })
                    }
                }
            }
        }

        return toReturn;
    } catch (err) {
        console.log("Could Not Get Activities =>", err);
        throw new MyError(Errors.NOT_GET_ACTIVITIES);
    }
}