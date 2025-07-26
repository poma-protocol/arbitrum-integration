import Web3, { Web3Account } from "web3";
import { contract, web3, proofOfPlayBobWeb3 } from "./account";
import { Errors, MyError } from "../helpers/errors";
import "dotenv/config";
import infisical from "../helpers/infisical";

export class SmarContract {
    web3: Web3
    proofOfPlayBobWeb3: Web3

    constructor(web3: Web3) {
        this.web3 = web3;
        this.proofOfPlayBobWeb3 = proofOfPlayBobWeb3
    }

    private async getAccount(): Promise<Web3Account> {
        try {
            const privateKey = await infisical.getSecret("PRIVATE_KEY", process.env.INFISICAL_ENVIRONMENT);
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            return account;
        } catch(err) {
            console.log("Error getting account", err);
            throw new MyError(Errors.NOT_GET_ACCOUNT);
        }
    }

    async test() {
        try {
            const chainID = await this.web3.eth.getChainId()
            console.log("Chain =>", chainID);
        } catch (err) {
            console.log("Error =>", err);
        }
    }

    async createActivity(activityID: number, gameID: number, winningPoints: number, name: string, reward: number, creatorAddress: string, maximumNumberPlayers: number): Promise<string> {
        try {
            const account = await this.getAccount();
            console.log("Account =>", account.address);
            const rewardInWei = Number.parseInt(web3.utils.toWei(reward.toString(), "ether"));
            const block = await web3.eth.getBlock();
            const transaction = {
                from: account.address,
                to: process.env.CONTRACT,
                data: contract.methods.createActivity(
                    BigInt(activityID),
                    BigInt(gameID),
                    BigInt(winningPoints),
                    name,
                    BigInt(rewardInWei),
                    creatorAddress,
                    BigInt(maximumNumberPlayers)
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
        } catch (err) {
            console.log("Error Creating Activity =>", err);
            throw new MyError(Errors.NOT_CREATE_ACTIVITY);
        }
    }

    async addParticipant(activityID: number, address: string): Promise<string> {
        try {
            const account = await this.getAccount();
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
        } catch (err) {
            console.log("Error Adding Participant =>", err);
            throw new MyError(Errors.NOT_ADD_PARTICIPANT);
        }
    }

    async updatePoints(activityID: number, address: string, points: number): Promise<string> {
        try {
            const account = await this.getAccount();
            const block = await web3.eth.getBlock();
            const transaction = {
                from: account.address,
                to: process.env.CONTRACT,
                data: contract.methods.updatePoints(
                    BigInt(activityID),
                    address,
                    BigInt(points)
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
        } catch (err) {
            if (err.name) {
                if (err.name === "ContractExecutionError") {
                    // TODO: Find way to know that error could be cause of low ETH
                    console.log(err.cause)
                } else {
                    console.log("Error in contract =>", err);
                }
            } else {
                console.log("Error Updating Points =>", err);
            }
            throw new MyError(Errors.NOT_UPDATE_POINTS);
        }
    }

    async getProofOfPlayBossLatestBlock(): Promise<BigInt> {
        try {
            return this.proofOfPlayBobWeb3.eth.getBlockNumber();
        } catch(err) {
            console.log("Could not get latest block", err);
            throw new MyError(Errors.NOT_GET_LATEST_BLOCK);
        }
    }
}

const smartContract = new SmarContract(web3);
export default smartContract;