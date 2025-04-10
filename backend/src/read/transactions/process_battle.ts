import { and, eq, or, sql } from "drizzle-orm";
import { db } from "../../db/pool";
import { activityPlayers, type1foundTransactions } from "../../db/schema";
import { Activity } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import smartContract from "../../smartcontract";
import { decodeTransactionInput } from "./decode-transaction";
import { getTransactions } from "./rpc";
import sendWorxNotification from "../../controller/battle/sendNotification";
import { NO_TRANSACTION } from "../../helpers/constants";
import isMultiLevelFunction from "../../controller/is_multi_method";

export default async function processBattle(activity: Activity, startBlock: number, endBlock: number | undefined): Promise<number> {
    try {
        console.log(`\nActivity ID => ${activity.id}\n`);
        const contract = activity.address;
        const playerAddressVariable = activity.playerAddressVariable;
        const functionName = activity.functionName;
        const goal = activity.goal;

        const players = activity.players.map((p) => {
            return {
                address: p.address.toLocaleLowerCase(),
                worx_id: p.worx_id,
                operator: p.operator
            }
        });
        // Object with found of each player
        let found = activity.found

        const resp = await getTransactions(startBlock, contract, endBlock);
        if (resp.result) {
            if (players.length > 0) {
                for (let transaction of resp.result) {
                    if (players.length <= 0) {
                        console.log("Done Searching!");
                        break;
                    }

                    // Decode transaction data
                    const decoded = decodeTransactionInput(transaction.input, activity.abi, activity.address)

                    // Get if transaction is of the right method
                    const method = (decoded["__method__"]) as string

                    if (method.includes(functionName)) {
                        const isMulti = isMultiLevelFunction(playerAddressVariable);
                        let intermediate: any;
                        for (let i = 0; i < isMulti.length; i++) {
                            if (i == 0) {
                                intermediate = decoded[isMulti[i]];
                            } else {
                                intermediate = intermediate[isMulti[i]];
                            }
                        }
                        // Get player in transaction
                        const origPlayer = intermediate as string
                        const decodedPlayer = origPlayer.toLowerCase();

                        // Check if the player is one of the tracked players
                        const foundPlayer = players.find((p) => p.operator === decodedPlayer || p.address === decodedPlayer);
                        if (foundPlayer) {
                            found[decodedPlayer]++;

                            console.log(`Transaction for ${decodedPlayer} in activity ${activity.id} found ${found[decodedPlayer]} times with goal ${goal}`);

                            // Update contract
                            let updateHash = NO_TRANSACTION;
                            if (activity.reward) {
                                console.log("Contract called");
                                updateHash = await smartContract.updatePoints(
                                    activity.id,
                                    foundPlayer.address.toLowerCase(),
                                    1
                                );
                            }

                            await db.insert(type1foundTransactions).values({
                                txHash: transaction.hash,
                                activity_id: activity.id,
                                playerAddress: foundPlayer.address.toLowerCase(),
                                update_tx_hash: updateHash
                            });

                            if (found[decodedPlayer] >= goal) {
                                // Update Worx
                                let worx_id = "";
                                if (foundPlayer.worx_id) {
                                    worx_id = await sendWorxNotification({
                                        worx_id: foundPlayer.worx_id,
                                        milestone_id: activity.id,
                                        reward: activity.reward
                                    })
                                }

                                console.log("ALERT!");
                                // Remove player
                                const playerIndex = players.indexOf(foundPlayer);
                                players.splice(playerIndex, 1);

                                await db.update(activityPlayers).set({
                                    done: true,
                                    worxUpdateID: worx_id
                                }).where(and(eq(activityPlayers.activityId, activity.id), eq(activityPlayers.playerAddress, foundPlayer.address)));

                                // Remove player from found
                                delete found[decodedPlayer];
                            }
                        }
                    }
                }
            } else {
                console.log("No players")
            }

            endBlock = Number.parseInt(resp.result[resp.result.length - 1].blockNumber);
            console.log("End Block =>", endBlock);
        }

        return endBlock ?? startBlock;
    } catch (err) {
        console.log("Error processing battles =>", err);
        throw new MyError(Errors.NOT_PROCESS_BATTLE);
    }
}