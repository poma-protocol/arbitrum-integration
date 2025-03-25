import { Web3 } from "web3";
import "dotenv/config";
import { Errors, MyError } from "../helpers/errors";
import abi from "../../contractAbi.json";

if(!process.env.RPC_URL) {
    console.log("Set RPC URL in env");
    throw new MyError(Errors.SERVER_SETUP);
}

export const web3: Web3 = new Web3(process.env.RPC_URL);
export const proofOfPlayAlexWeb3: Web3 = new Web3("https://rpc.apex.proofofplay.com");
if(!process.env.CONTRACT) {
    console.log("Set contract address in env");
    throw new MyError(Errors.SERVER_SETUP);
}

// export const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
export const contract = new web3.eth.Contract(abi["abi"], process.env.CONTRACT);