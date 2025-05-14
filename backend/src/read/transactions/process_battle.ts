import { Activity } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import { _processForwadedEvent, _processNonForwardedEvent } from "./process_battle_helpers";
import { getTransactions, TransactionResponse } from "./rpc";

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
            console.info("Forwarded activity");
            resp = await getTransactions(startBlock, activity.forwarder!.address, endBlock);
        } else {
            console.info("Non forwarded activity");
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

