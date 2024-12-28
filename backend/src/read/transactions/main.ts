import { decodeTransactionInput } from "./decode-transaction";
import { getBlockNumber, getTransactions } from "./rpc";
import "dotenv/config";
import { Activities } from "./data";
import { sleep } from "../../helpers";

async function main() {
    try {
        let startBlock = process.env.BLOCK_NUMBER;
        while (true) {
            console.log(`Search starting at ${startBlock}...`)
            let endBlock: number | undefined = undefined;
            const activities = Activities

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
                for (let transaction of resp.result) {
                    if (players.length <= 0) {
                        console.log("Done Searching!");
                        break;
                    }

                    // Decode transaction data
                    const decoded = decodeTransactionInput(transaction.input, activity.abi)
                    // Get if transaction is of the right method
                    const method = (decoded["__method__"]) as string
                    if (method.includes(functionName)) {
                        // Get player in transaction
                        let decodedPlayer = (decoded[playerAddressVariable]) as string
                        decodedPlayer = decodedPlayer.toLowerCase();

                        // Check if the player is one of the tracked players
                        if (players.includes(decodedPlayer)) {
                            found[decodedPlayer]++;

                            console.log(`Transaction for ${decodedPlayer} in activity ${i} found ${found[decodedPlayer]} times`)

                            if (found[decodedPlayer] >= goal) {
                                console.log("ALERT!");
                                // Remove player
                                const playerIndex = players.indexOf(decodedPlayer);
                                players.splice(playerIndex, 1);

                                // Remove player from found
                                delete found[decodedPlayer];
                            }
                        }
                    }
                }

                endBlock = Number.parseInt(resp.result[resp.result.length - 1].blockNumber)
                console.log("End Block =>", endBlock);
            }

            await sleep(3000);
            startBlock = endBlock ?? startBlock;
        }
    } catch (err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();