export interface Transaction {
    blockHash: string,
    blockNumber: string,
    confirmations: string,
    contractAddress: string,
    cumulativeGasUsed: string,
    from: string,
    gas: string,
    gasPrice: string,
    gasUsed: string,
    hash: string,
    input: string,
    isError: string,
    nonce: string,
    timeStamp: string,
    to: string,
    transactionIndex: string,
    txreceipt_status: string,
    value: string
}
export interface TransactionResponse {
    message: string,
    result: Transaction[],
    status: string
}

// Endblock is not included in range (make it endblock + 1 if you want endblock in it)
export async function getTransactions(startBlock: number, contractAddress: string, endBlock?: number): Promise<TransactionResponse> {
    try {
        let endpoint: string;
        if(endBlock) {
            endpoint = `https://explorer.boss.proofofplay.com/api?module=account&action=txlist&address=${contractAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=asc`;
        } else {
            endpoint = `https://explorer.boss.proofofplay.com/api?module=account&action=txlist&address=${contractAddress}&startblock=${startBlock}&sort=asc`
        }

        const response = await fetch(
            endpoint,
            {
                method: "POST"
            }
        );

        if (response.status !== 200) {
            console.log("Error Getting Transactions", await response.json());
            throw new Error("Error Getting Transactions")
        }
        return await response.json();
    } catch(err) {
        console.log("Could Not Get Transactions =>", err);
        throw new Error("Could Not Get Transactions");
    }
}



export async function getBlockNumber(): Promise<string> {
    try {
        const response = await fetch("https://explorer.boss.proofofplay.com/api?module=block&action=eth_block_number");
        
        if (response.ok) {
            const body = await response.json();
            return body['result']
        } else {
            throw new Error("Could Not Get Block Number");
        }
    } catch(err) {
        console.log("Error Getting Block Number =>", err);
        throw new Error("Could Not Get Block Number");
    }
}