import { Web3 } from "web3";

const web3 = new Web3('wss://ethereum-rpc.publicnode.com');

async function main() {
    // Listening for every new block
    const subscription = await web3.eth.subscribe('newBlockHeaders');
    subscription.on('data', async (data) => {
        // Assume that when a new block is created it means that the previous block has been finalized so we can process its transactions
        if (data.number) {
            if (typeof data.number === "bigint" || typeof data.number === "number") {
                let prevBlockNum: number | bigint
                if (typeof data.number === "number") {
                    prevBlockNum = data.number - 1;
                } else {
                    prevBlockNum = data.number - 1n;
                }

                const blockToProcess = await web3.eth.getBlock(prevBlockNum, true);
                const transactions = blockToProcess.transactions;
                console.log("Block Number =>", prevBlockNum);
                console.log("Number of Transactions =>", transactions.length);
                console.log("First Transaction =>", transactions[0]);
            } else {
                console.log("Block number is an enum!", data.number);
            }
        } else {
            console.log("Data has no number!");
        }
    });
}

main();