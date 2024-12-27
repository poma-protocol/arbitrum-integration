import { decodeTransactionInput } from "./decode-transaction";
import { getBlockNumber, getTransactions } from "./rpc";
import "dotenv/config";

async function main() {
    try {
        const startBlock = process.env.BLOCK_NUMBER;
        const contract = "0xD4a3f1D145C185E222cCC03D60A1D9fB5e0c2048";
        const playerAddressVariable = "operatorWallet";
        const functionName = "startAndEndValidatedDungeonBattle";
        const goal = 2;

        const players = [("0x139e7542fefc910bb19e73c0dce00c675361c68d").toLowerCase(), ("0x8c033c70ce5788b243af5215ec12e2cfa79bdb34").toLowerCase()]
        // Object with found of each player
        let found = {};
        for (let player of players) {
            found[player] = 0
        }
        const resp = await getTransactions(startBlock, contract);
        for (let transaction of resp.result) {
            if (players.length <= 0) {
                console.log("Done Searching!");
                break;
            }

            // Decode transaction data
            const decoded = decodeTransactionInput(transaction.input)
            // Get if transaction is of the right method
            const method = (decoded["__method__"])as string
            if(method.includes(functionName)) {
                // Get player in transaction
                let decodedPlayer = (decoded[playerAddressVariable]) as string
                decodedPlayer = decodedPlayer.toLowerCase();

                // Check if the player is one of the tracked players
                if (players.includes(decodedPlayer)) {
                    found[decodedPlayer]++;

                    if (found[decodedPlayer] >= goal) {
                        // Remove player
                        const playerIndex = players.indexOf(decodedPlayer);
                        players.splice(playerIndex, 1);

                        // Remove player from found
                        delete found[decodedPlayer];
                    }
                }
            }
        }
    } catch(err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();