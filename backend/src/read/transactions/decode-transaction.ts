import { ContractAbi, Web3 } from "web3";
import "dotenv/config";

export function decodeTransactionInput(input: string, ABI: ContractAbi, contractAddress: string): Record<string, any> {
    try {
        const web3 = new Web3();
        const contract = new web3.eth.Contract(ABI, contractAddress);

        // Decode transaction input
        const result = contract.decodeMethodData(input);
        return result;
    } catch (err) {
        console.log("Error Decoding Transaction =>", err);
        throw new Error("Could Not Decode Transaction");
    }
}
