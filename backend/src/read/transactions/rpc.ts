export async function getBlockNumber(): Promise<string> {
    try {
        const response = await fetch("https://explorer.apex.proofofplay.com/api?module=block&action=eth_block_number");
        
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

(async () => {
    try {
        console.log(await getBlockNumber())
    } catch(err) {
        console.log("Error =>", err);
    }
})();