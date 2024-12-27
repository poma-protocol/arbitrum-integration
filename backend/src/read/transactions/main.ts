import { getBlockNumber, getTransactions } from "./rpc";
import "dotenv/config";

async function main() {
    try {
        const startBlock = process.env.BLOCK_NUMBER;
        const resp = await getTransactions(startBlock, "0xD4a3f1D145C185E222cCC03D60A1D9fB5e0c2048");

        const player = ("0x9e1c54Bd65Ed82C81aB4C25Cdeba81E76F4fb064").toLowerCase();
        for (let transaction of resp.result) {
            if (transaction.from === player) {
                console.log("Player Transaction");
                console.log(transaction);
            }
        }
    } catch(err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();