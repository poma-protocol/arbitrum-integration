import "dotenv/config";
import { sleep } from "../../helpers";
import { getActivities } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import lmdb from "../../store";
import { START_BLOCK_KEY } from "../../helpers/constants";
import processBattle from "./process_battle";
import smartContract from "../../smartcontract";
import activityController from "../../controller/activity";
import activityModel from "../../database/activity";

if (!process.env.BLOCK_NUMBER) {
    console.log("Need to set block number in env");
    throw new MyError(Errors.SERVER_SETUP);
}

async function main() {
    try {
        let startBlock = Number.parseInt(process.env.BLOCK_NUMBER!);

        // Set startblock if empty
        const start = await lmdb.read(START_BLOCK_KEY);
        console.log("Start From LMDB =>", start);
        if (!start) {
            await lmdb.store(START_BLOCK_KEY, startBlock.toString());
        } else {
            if (Number.parseInt(start) > startBlock) {
                startBlock = Number.parseInt(start)
            }
        }

        let endBlock: number | undefined = undefined;
        if (process.env.END_BLOCK) {
            endBlock = Number.parseInt(process.env.END_BLOCK);
        }

        while (true) {
            if (startBlock === endBlock) {
                endBlock = undefined;
            }

            console.log(`\nProcessing Battles\n`);
            // Getting battle activities
            const activities = await getActivities();
            console.log("Number of activities", activities.length);

            // Processing battle activities
            for (let activity of activities) {
                console.log("Start block ->", startBlock, "End block ->", endBlock);
                const newEndBlock = await processBattle(activity, startBlock, endBlock, activityController, activityModel, smartContract);
                if (newEndBlock && (endBlock === undefined || endBlock < newEndBlock)) {
                    endBlock = newEndBlock;
                }
                console.log("Returned endblock", newEndBlock, "Current endblock =>", endBlock);
            }

            // console.log(`\nProcessing Jackpots\n`);
            // Getting jackpot activities
            // const jackpots = await getJackpots();

            // // Processing jackpots
            // for (let jackpot of jackpots) {
            //     endBlock = await processJackpot(jackpot, startBlock, endBlock, database);
            // }

            await sleep(3000);
            startBlock = endBlock ?? startBlock;


            if (activities.length === 0) {
                console.log("No battles");
                const latestBlock = await smartContract.getProofOfPlayBossLatestBlock();
                startBlock = Number(latestBlock);
            }

            await lmdb.store<string>(START_BLOCK_KEY, startBlock.toString());
            console.log("Start block stored =>", startBlock);
            await sleep(2000);
        }
    } catch (err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();