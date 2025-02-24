import Web3, { ContractOnceRequiresCallbackError } from "web3";
import { account, contract, web3 } from "./account";
import { Errors, MyError } from "../helpers/errors";
import "dotenv/config";

export class SmarContract {
    web3: Web3

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    async test() {
        try {
            const chainID = await this.web3.eth.getChainId()
            console.log("Chain =>", chainID);
        } catch(err) {
            console.log("Error =>", err);
        }
    }

    async createActivity(activityID: number, gameID: number, winningPoints: number, name: string, reward: number): Promise<string> {
        try {
            const block = await web3.eth.getBlock();
            const transaction = {
                from: account.address,
                to: process.env.CONTRACT,
                data: contract.methods.createActivity(
                    BigInt(activityID),
                    BigInt(gameID),
                    BigInt(winningPoints),
                    name,
                    BigInt(reward)
                ).encodeABI(),
                maxFeePerGas: block.baseFeePerGas! * 2n,
                maxPriorityFeePerGas: 100000,
            };
            const signedTransaction = await web3.eth.accounts.signTransaction(
                transaction,
                account.privateKey,
            );
            const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            return receipt.transactionHash.toString();
        } catch(err) {
            console.log("Error Creating Activity =>", err);
            throw new MyError(Errors.NOT_CREATE_ACTIVITY);
        }
    }

    async addParticipant(activityID: number, address: string): Promise<string> {
        try {
            const block = await web3.eth.getBlock();
            const transaction = {
                from: account.address,
                to: process.env.CONTRACT,
                data: contract.methods.addParticipant(
                    BigInt(activityID), 
                    address
                ).encodeABI(),
                maxFeePerGas: block.baseFeePerGas! * 2n,
                maxPriorityFeePerGas: 100000,
            };

            const signedTransaction = await web3.eth.accounts.signTransaction(
                transaction,
                account.privateKey,
            );
            const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            return receipt.transactionHash.toString();
        } catch(err) {
            console.log("Error Adding Participant =>", err);
            throw new MyError(Errors.NOT_ADD_PARTICIPANT);
        }
    }

    async updatePoints(activityID: number, address: string, points: number) {
        try {
            await contract.methods.updatePoints(
                BigInt(activityID),
                address,
                BigInt(points)
            ).send({
                from: account.address,
                gas: '1000000',
                gasPrice: "10000000000"
            })
        } catch(err) {
            console.log("Error Updating Points =>", err);
            throw new MyError(Errors.NOT_UPDATE_POINTS);
        }
    }
}

const smartContract = new SmarContract(web3);
export default smartContract;