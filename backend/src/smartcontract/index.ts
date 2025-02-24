import Web3, { ContractOnceRequiresCallbackError } from "web3";
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

    async createActivity(activityID: number, gameID: number, winningPoints: number, name: string, reward: number): Promise<number> {
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
            console.log("Transaction hash =>", receipt.transactionHash);

            //@ts-ignore
            // const events = await contract.getPastEvents("ActivityCreated", {from: BigInt(125979537)});
            // console.log(events);

            // const log = receipt.logs[0];
            // const data = contract.decodeMethodData(log.data!.toString());
            // console.log("Data", data);
            // @ts-ignore
            // return Number.parseInt(id);

            // const receipt = await contract.methods.createActivity(
            //     BigInt(activityID),
            //     BigInt(gameID),
            //     BigInt(winningPoints),
            //     name,
            //     BigInt(reward)
            // ).send({
            //     from: account.address,
            //     gas: '1000000',
            //     gasPrice: "10000000000",
            // });
            // console.log("Receipt =>", receipt);

            return 1;
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
(async () => {
    const id = await smartContract.createActivity(1, 1, 1, "Test", 1);
    console.log("Done", id);
})();