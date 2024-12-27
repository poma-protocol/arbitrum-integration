import { decodeTransactionInput } from "./decode-transaction";
import { getBlockNumber, getTransactions } from "./rpc";
import "dotenv/config";

async function main() {
    try {
        const startBlock = process.env.BLOCK_NUMBER;
        const resp = await getTransactions(startBlock, "0xD4a3f1D145C185E222cCC03D60A1D9fB5e0c2048");

        const player = ("0x139e7542fefc910bb19e73c0dce00c675361c68d").toLowerCase();
        const playerAddressVariable = "operatorWallet"
        const functionName = "startAndEndValidatedDungeonBattle"
        for (let transaction of resp.result) {
            // Decode transaction data
            const decoded = decodeTransactionInput(transaction.input)

            // Get if transaction is of the right method
            const method = (decoded["__method__"])as string
            if(method.includes(functionName)) {
                // Get transaction for a certain player
                const decodedPlayer = (decoded[playerAddressVariable]) as string
                if (decodedPlayer.toLowerCase() === player) {
                    console.log("Player Transaction");
                    console.log(transaction)
                }
            }
        }
    } catch(err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();