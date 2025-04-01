import { MyDatabase } from "../../database";
import { Jackpot } from "../../game/getJacpots";
import { Errors, MyError } from "../../helpers/errors";
import { decodeTransactionInput } from "./decode-transaction";
import { getTransactions } from "./rpc";

export default async function processJackpot(jackpot: Jackpot, startBlock: number, endBlock: number | undefined, db: MyDatabase): Promise<number | undefined> {
    try {
        // Check if jackpot has expired
        if (new Date() > jackpot.endDate) {
            //TODO: Choose random player from raffle

            // Mark jackpot as done
            await db.markJackpotAsCompleted(jackpot.id);

            return endBlock;
        }   


        console.log(`\nActivity ID => ${jackpot.id}\n`);
        const contract = jackpot.address;
        const playerAddressVariable = jackpot.playerAddressVariable;
        const functionName = jackpot.functionName;
        const requirement = jackpot.requirement;

        const players = jackpot.players.map((p) => p.toLowerCase());
        // Object with found of each player
        let found = jackpot.found

        const resp = await getTransactions(startBlock, contract, endBlock);
        if (resp.result) {
            if (players.length > 0) {
                for (let transaction of resp.result) {
                    if (players.length <= 0) {
                        console.log("Done Searching!");
                        break;
                    }
    
                    // Decode transaction data
                    const decoded = decodeTransactionInput(transaction.input, jackpot.abi, jackpot.address)
    
                    // Get if transaction is of the right method
                    const method = (decoded["__method__"]) as string
                    if (method.includes(functionName)) {
                        // Get player in transaction
                        const origPlayer = (decoded[playerAddressVariable]) as string
                        const decodedPlayer = origPlayer.toLowerCase();
    
                        // Check if the player is one of the tracked players
                        if (players.includes(decodedPlayer)) {
                            found[decodedPlayer]++;
    
                            console.log(`Transaction for ${decodedPlayer} in jackpot ${jackpot.id} found ${found[decodedPlayer]} times`);
    
                            // Update DB with found transaction
                            await db.markJackpotPlayerFound(jackpot.id, decodedPlayer, transaction.hash);
    
                            if (found[decodedPlayer] >= jackpot.requirement) {
                                console.log("ALERT!");
                                // Enter player in raffle
                                await db.enterPlayerInRaffle(jackpot.id, decodedPlayer);
    
                                // Remove player
                                const playerIndex = players.indexOf(decodedPlayer);
                                players.splice(playerIndex, 1);
    
                                // Remove player from found
                                delete found[decodedPlayer];
                            }
                        }
                    }
                }
            } else {
                console.log("No players")
            }
    
            endBlock = Number.parseInt(resp.result[resp.result.length - 1].blockNumber);
            console.log("End Block =>", endBlock);
        }
        
        return endBlock ?? startBlock;
    } catch (err) {
        console.log("Error processing battles =>", err);
        throw new MyError(Errors.NOT_PROCESS_BATTLE);
    }
}