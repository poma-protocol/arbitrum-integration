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

                try {
                    const blockToProcess = await web3.eth.getBlock(prevBlockNum, true);
                    const transactions = blockToProcess.transactions;
                    console.log("Block Number =>", prevBlockNum);
                    
                    // For now test with USDC
                    for (const transaction of transactions) {
                        if (typeof transaction !== "string") {
                            // Check to account to see if it matches the game contract
                            if (transaction.to === "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".toLowerCase()) {
                                console.log("USDC transaction");
                                console.log(transaction);
                                // Check from account to see if its for a player using Poma
                            }
                        } else {
                            console.log("Transaction is just a string!", transaction);
                        }
                    }
                    

                } catch(err) {
                    console.log("Error Processing Block =>", err);
                }
            } else {
                console.log("Block number is an enum!", data.number);
            }
        } else {
            console.log("Data has no number!");
        }
    });
}

main();