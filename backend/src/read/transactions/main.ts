import { getBlockNumber } from "./rpc";

async function main() {
    try {
        let blockNumber = await getBlockNumber();

        while (true) {
            const newBlockNumber = await getBlockNumber();
            if (parseInt(newBlockNumber, 16) !== parseInt(blockNumber, 16)) {
                let increment = blockNumber;
                while (parseInt(increment, 16) <= parseInt(newBlockNumber, 16)) {
                    console.log("Block Number =>", increment);
                    increment = (parseInt(increment, 16) + 1).toString(16);
                }
                blockNumber = increment;
            }
        }
    } catch(err) {
        console.log("Error Getting Transactions =>", err);
    }
}


// import { Alchemy, Network } from "alchemy-sdk";
// import "dotenv/config";

// const settings = {
//     apiKey: process.env.ARIBTRUM_NOVA_KEY,
//     network: Network.ARBNOVA_MAINNET
// }

// async function main() {
//     const alchemy = new Alchemy(settings);

//     let blockNumber = await alchemy.core.getBlockNumber();
//     while (true) {
//         // Get block number
//         let newBlockNumber = await alchemy.core.getBlockNumber();
//         if (newBlockNumber !== blockNumber) {
//             blockNumber = newBlockNumber

//             console.log("Block Number =>", blockNumber);

//             // Get transactions of block
//             const block = await alchemy.core.getBlock(blockNumber);

//             for (let t of block.transactions) {
//                 const transaction = await alchemy.core.getTransaction(t);
//                 if (transaction) {
//                     // Check to account to see if it matches the game contract
//                     if (transaction.to === "0x00000000000000000000000000000000000A4B05") {
//                         console.log("USDC transaction");
//                         console.log(transaction);
//                         // Check method being called
//                     }
//                 }

//             }
//         }
//     }
// }

main();