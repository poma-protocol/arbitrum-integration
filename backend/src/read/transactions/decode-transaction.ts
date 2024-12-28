import {ContractAbi, Web3} from "web3";
import "dotenv/config";

export function decodeTransactionInput(input: string, ABI: ContractAbi): Record<string, any> {
    try {
        const web3 = new Web3();
        const contract = new web3.eth.Contract(ABI, "0x781222dc4cab3CdC6F9Be3d484d39F90c4832018");
        
        // Decode transaction input
        const result = contract.decodeMethodData(input);
        return result;
    } catch(err) {
        console.log("Error Decoding Transaction =>", err);
        throw new Error("Could Not Decode Transaction");
    }
}