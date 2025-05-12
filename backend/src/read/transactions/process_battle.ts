import { and, eq } from "drizzle-orm";
import { db } from "../../db/pool";
import { activityPlayers, type1foundTransactions } from "../../db/schema";
import { Activity } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import smartContract from "../../smartcontract";
import { decodeTransactionInput } from "./decode-transaction";
import { getTransactions, Transaction, TransactionResponse } from "./rpc";
import sendWorxNotification from "../../controller/battle/sendNotification";
import { NO_TRANSACTION } from "../../helpers/constants";
import isMultiLevelFunction from "../../controller/is_multi_method";

interface Players {
    address: string;
    worx_id: string | null;
    operator: string | undefined;
}

export default async function processBattle(activity: Activity, startBlock: number, endBlock: number | undefined): Promise<number> {
    try {
        console.log(`\nActivity ID => ${activity.id}\n`);
        const contract = activity.address;
        console.log(contract);
        const playerAddressVariable = activity.playerAddressVariable;

        const players = activity.players.map((p) => {
            return {
                address: p.address.toLocaleLowerCase(),
                worx_id: p.worx_id,
                operator: p.operator?.toLocaleLowerCase()
            }
        });
        console.log("Players", players);
        console.log("Found", activity.found);

        // In pop forwarder first arguement is operator address of player

        // Get if using a forwarder or using contract
        const usingForwarder = activity.forwarder !== undefined;

        let resp: TransactionResponse;
        if (usingForwarder === true) {
            resp = await getTransactions(startBlock, activity.forwarder!.address, endBlock);
        } else {
            resp = await getTransactions(startBlock, contract, endBlock);
        }

        if (resp.result) {
            console.log("No of Transactions => ", resp.result.length);
            if (players.length > 0) {
                for (let transaction of resp.result) {
                    if (players.length <= 0) {
                        console.log("Done Searching!");
                        break;
                    }

                    try {
                        if (usingForwarder === false) {
                            await _processNonForwardedEvent(
                                transaction,
                                activity,
                                playerAddressVariable,
                                players
                            );
                        } else {
                            await _processForwadedEvent(
                                transaction,
                                activity,
                                players
                            );
                        }
                    } catch (err) {
                        console.error(err);
                        console.log("Skipping transaction");
                        continue;
                    }
                }
            } else {
                console.log("No players")
            }

            endBlock = resp.result[resp.result.length - 1]?.blockNumber ? Number.parseInt(resp.result[resp.result.length - 1]?.blockNumber) : startBlock;
            console.log("End Block =>", endBlock);
        }

        return endBlock ?? startBlock;
    } catch (err) {
        console.log("Error processing battles =>", err);
        throw new MyError(Errors.NOT_PROCESS_BATTLE);
    }
}

async function _processNonForwardedEvent(transaction: Transaction, activity: Activity, playerAddressVariable: string, players: Players[]) {
    console.info("Processing non forwarded event");
    try {
        // Decode transaction data
        const decoded = decodeTransactionInput(transaction.input, activity.abi, activity.address)

        // Get if transaction is of the right method
        const method = (decoded["__method__"]) as string

        if (method.includes(activity.functionName)) {
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
            if (intermediate) {
                const origPlayer = intermediate as string

                const decodedPlayer = origPlayer.toLowerCase();
                // console.log("Player =>", decodedPlayer)

                // Check if the player is one of the tracked players
                console.log("Decoded player =>", decodedPlayer);
                const foundPlayer = players.find((p) => p.operator === decodedPlayer || p.address === decodedPlayer);
                // console.log("found player ->", foundPlayer);
                if (foundPlayer) {
                    await _processFoundTransaction(
                        decodedPlayer,
                        activity,
                        players,
                        foundPlayer,
                        transaction
                    );
                }
            }
        }
    } catch (err) {
        console.error("Could not process non forwarded event", err);
    }
}

// Assumes transaction that hit the forwarding contract contains the player address, contract being sent to and its data
async function _processForwadedEvent(transaction: Transaction, activity: Activity, players: Players[]) {
    try {
        if (!activity.forwarder) {
            console.info("Details of forwarder contract are missing");
            return;
        }
        // Decoded forwarded event to get player address, contract and data
        const decoded = decodeTransactionInput(transaction.input, activity.forwarder!.abi, activity.forwarder!.address);

        const player_address: string = decoded['0']['from'].toLowerCase();
        const contract: string = decoded['0']['to'].toLowerCase();
        const data: string = decoded['0']['data'];

        // If contract is not for event end
        if (contract !== activity.address.toLowerCase()) {
            console.info("The event does not belong to activity", activity.id, "activity address =>", activity.address, "event contract =>", contract);
            return;
        }

        // If player not participating in activity end
        const foundPlayer = players.find((p) => p.operator === player_address || p.address === player_address);
        if (!foundPlayer) {
            console.info("Event does not include player for activity", activity.id, "detected player =>", player_address);
            return;
        }

        // Decode forwarded event data to check if correct method
        const decoded_event = decodeTransactionInput(data, activity.abi, activity.address);
        const method = (decoded_event["__method__"]) as string;

        if (!method.includes(activity.functionName)) {
            console.info("Event is for a different function", activity.id, "activity function =>", activity.functionName, "detected function =>", method, "found player address =>", foundPlayer.address);
            return;
        }

        // If corret send reward
        await _processFoundTransaction(
            player_address,
            activity,
            players,
            foundPlayer,
            transaction
        );
    } catch (err) {
        console.error("Could not process forwarded event", err);
    }
}

async function _processFoundTransaction(decodedPlayer: string, activity: Activity, players: Players[], foundPlayer: Players, transaction: Transaction) {
    try {
        let foundPlayerAddress = decodedPlayer;
        if (Number.isNaN(activity.found[decodedPlayer]) || activity.found[decodedPlayer] === undefined) {
            console.log("Decoded player not in found");
            // This means that decodedPlayer is the players address and not the operator address
            const player = players.find((p) => p.address === decodedPlayer);
            if (player) {
                console.log("Found player =>", player);
                foundPlayerAddress = player?.operator ?? "";
            }
        }
        activity.found[foundPlayerAddress] += 1;

        console.log(`Transaction for ${decodedPlayer} in activity ${activity.id} found ${activity.found[foundPlayerAddress]} times with goal ${activity.goal}`);

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

        if (activity.found[foundPlayerAddress] >= activity.goal) {
            console.log("ALERT!");
            // Remove player
            const playerIndex = players.indexOf(foundPlayer);
            players.splice(playerIndex, 1);

            // Update Worx
            let worx_id = "";
            try {
                if (foundPlayer.worx_id) {
                    worx_id = await sendWorxNotification({
                        worx_id: foundPlayer.worx_id,
                        milestone_id: activity.id,
                        reward: activity.reward
                    })
                }
            } catch (err) {
                console.log("Update worx failed", err);
            }

            await db.update(activityPlayers).set({
                done: true,
                worxUpdateID: worx_id
            }).where(and(eq(activityPlayers.activityId, activity.id), eq(activityPlayers.playerAddress, foundPlayer.address)));

            // Remove player from found
            delete activity.found[foundPlayerAddress];
        }
    } catch (err) {
        console.error("Could not process the found transcation", err);
    }
}