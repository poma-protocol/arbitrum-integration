import "dotenv/config";
import { sleep } from "../../helpers";
import { getActivities } from "../../game/getActivities";
import { Errors, MyError } from "../../helpers/errors";
import lmdb from "../../store";
import { START_BLOCK_KEY } from "../../helpers/constants";
import processBattle from "./process_battle";
import smartContract from "../../smartcontract";

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



        while (true) {
            console.log(`Search starting at ${startBlock}...`)
            let endBlock: number | undefined = undefined;

            console.log(`\nProcessing Battles\n`);
            // Getting battle activities
            const activities = await getActivities();

            // Processing battle activities
            for (let activity of activities) {
                endBlock = await processBattle(activity, startBlock, endBlock);
            }

            console.log(`\nProcessing Jackpots\n`);
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
                const latestBlock = await smartContract.getProofOfPlayAlexLatestBlock();
                startBlock = Number(latestBlock);
            }

            await lmdb.store<string>(START_BLOCK_KEY, startBlock.toString());
            console.log("Start block stored =>", startBlock);
        }
    } catch (err) {
        console.log("Error Processing Transactions =>", err);
    }
}

main();