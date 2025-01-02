import { decodeTransactionInput } from "./decode-transaction";
import { getTransactions } from "./rpc";
import "dotenv/config";
import { sleep } from "../../helpers";
import { getActivities } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import { db } from "../../db/pool";
import { activityPlayers, type1foundTransactions } from "../../db/schema";
import { sql } from "drizzle-orm";
import smartContract from "../../smartcontract";
import lmdb from "../../store";
import { START_BLOCK_KEY } from "../../helpers/constants";

if (!process.env.BLOCK_NUMBER) {
    console.log("Need to set block number in env");
    throw new MyError(Errors.SERVER_SETUP);
}

async function main() {
    try {
        let startBlock = Number.parseInt(process.env.BLOCK_NUMBER!);

        // Set startblock if empty
        const start = await lmdb.read(START_BLOCK_KEY);
        console.log("Start From LMDB =>", start);
        if (!start) {
            await lmdb.store(START_BLOCK_KEY, startBlock.toString());
        } else {
            if (Number.parseInt(start) > startBlock) {
                startBlock = Number.parseInt(start)
            }
        }



        while (true) {
            console.log(`Search starting at ${startBlock}...`)
            let endBlock: number | undefined = undefined;
            const activities = await getActivities();

            let i = 0;
            for (let activity of activities) {
                console.log(`\nActivity ${i}\n`);
                i++;
                const contract = activity.address;
                const playerAddressVariable = activity.playerAddressVariable;
                const functionName = activity.functionName;
                const goal = activity.goal;

                const players = activity.players.map((p) => p.toLowerCase());
                // Object with found of each player
                let found = activity.found

                const resp = await getTransactions(startBlock, contract, endBlock);
                if (players.length > 0) {
                    for (let transaction of resp.result) {
                        if (players.length <= 0) {
                            console.log("Done Searching!");
                            break;
                        }
    
                        // Decode transaction data
                        //@ts-ignore
                        const decoded = decodeTransactionInput(transaction.input, activity.abi)
    
                        // Get if transaction is of the right method
                        const method = (decoded["__method__"]) as string
                        if (method.includes(functionName)) {
                            // Get player in transaction
                            const origPlayer = (decoded[playerAddressVariable]) as string
                            const decodedPlayer = origPlayer.toLowerCase();
    
                            // Check if the player is one of the tracked players
                            if (players.includes(decodedPlayer)) {
                                found[decodedPlayer]++;
    
                                console.log(`Transaction for ${decodedPlayer} in activity ${i} found ${found[decodedPlayer]} times`);
                                await db.insert(type1foundTransactions).values({
                                    txHash: transaction.hash,
                                    activity_id: activity.id,
                                    playerAddress: decodedPlayer
                                })

                                // Update contract
                                await smartContract.updatePoints(
                                    activity.id,
                                    decodedPlayer,
                                    1
                                );
    
                                if (found[decodedPlayer] >= goal) {
                                    console.log("ALERT!");
                                    // Remove player
                                    const playerIndex = players.indexOf(decodedPlayer);
                                    players.splice(playerIndex, 1);
    
                                    await db.update(activityPlayers).set({
                                        done: true
                                    }).where(sql`${activityPlayers.activityId} = ${activity.id} AND ${activityPlayers.playerAddress} = ${decodedPlayer}`)
    
                                    // Remove player from found
                                    delete found[decodedPlayer];
                                }
                            }
                        }
                    }
                } else {
                    console.log("No players")
                }

                endBlock = Number.parseInt(resp.result[resp.result.length - 1].blockNumber)
                console.log("End Block =>", endBlock);
            }

            await sleep(3000);
            startBlock = endBlock ?? startBlock;
            await lmdb.store<string>(START_BLOCK_KEY, startBlock.toString());
            console.log("Start block stored =>", startBlock);
        }
    } catch (err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();