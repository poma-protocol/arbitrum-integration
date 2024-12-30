import { Web3 } from "web3";
import "dotenv/config";
import { Errors, MyError } from "../helpers/errors";
import abi from "../../contractAbi.json";

export const web3 = new Web3("http://127.0.0.1:8545/");

if(!process.env.PRIVATE_KEY) {
    console.log("Set private key in env");
    throw new MyError(Errors.SERVER_SETUP);
}

if(!process.env.CONTRACT) {
    console.log("Set contract address in env");
    throw new MyError(Errors.SERVER_SETUP);
}

export const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
export const contract = new web3.eth.Contract(abi["abi"], process.env.CONTRACT);