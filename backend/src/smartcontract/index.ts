import Web3, { Contract } from "web3";
import { account, contract, web3 } from "./account";
import { Errors, MyError } from "../helpers/errors";

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

    async createActivity(gameID: number, winningPoints: number, name: string, reward: number): Promise<number> {
        try {
            const receipt = await contract.methods.createActivity(
                BigInt(gameID),
                BigInt(winningPoints),
                name,
                BigInt(reward)
            ).send({
                from: account.address,
                gas: '1000000',
                gasPrice: "10000000000"
            });
            console.log("Txhash =>", receipt);

            const id = receipt.events!['ActivityCreated']!['returnValues']['activityId']
            //@ts-ignore
            return Number.parseInt(id);
        } catch(err) {
            console.log("Error Creating Activity =>", err);
            throw new MyError(Errors.NOT_CREATE_ACTIVITY);
        }
    }

    async addParticipant(activityID: number, address: string) {
        try {
            await contract.methods.addParticipant(
                BigInt(activityID), 
                address
            ).send({
                from: account.address,
                gas: '1000000',
                gasPrice: "10000000000"
            })
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