import { and, eq } from "drizzle-orm";
import sendWorxNotification from "../../controller/battle/sendNotification";
import isMultiLevelFunction from "../../controller/is_multi_method";
import { db } from "../../db/pool";
import { activityPlayers, type1foundTransactions } from "../../db/schema";
import { Activity } from "../../game/getActivities";
import { NO_TRANSACTION } from "../../helpers/constants";
import smartContract from "../../smartcontract";
import { decodeTransactionInput } from "./decode-transaction";
import { Transaction } from "./rpc";

interface Players {
    address: string;
    worx_id: string | null;
    operator: string | undefined;
}

export async function _processNonForwardedEvent(transaction: Transaction, activity: Activity, playerAddressVariable: string, players: Players[]) {
    try {
        // Decode transaction data
        const decoded = decodeTransactionInput(transaction.input, activity.abi, activity.address)

        // Get if transaction is of the right method
        const method = (decoded["__method__"]) as string

        if (method.includes(activity.functionName)) {
            const isMulti = isMultiLevelFunction(playerAddressVariable);
            let intermediate: any;
            for (let i = 0; i < isMulti.length; i++) {
                if (i == 0) {
                    intermediate = decoded[isMulti[i]];
                } else {
                    intermediate = intermediate[isMulti[i]];
                }
            }
            // Get player in transaction
            if (intermediate) {
                const origPlayer = intermediate as string

                const decodedPlayer = origPlayer.toLowerCase();
                // console.log("Player =>", decodedPlayer)

                // Check if the player is one of the tracked players
                console.log("Decoded player =>", decodedPlayer);
                const foundPlayer = players.find((p) => p.operator === decodedPlayer || p.address === decodedPlayer);
                // console.log("found player ->", foundPlayer);
                if (foundPlayer) {
                    await _processFoundTransaction(
                        decodedPlayer,
                        activity,
                        players,
                        foundPlayer,
                        transaction,
                        decoded
                    );
                }
            }
        }
    } catch (err) {
        console.error("Could not process non forwarded event", err);
    }
}

// Assumes transaction that hit the forwarding contract contains the player address, contract being sent to and its data
export async function _processForwadedEvent(transaction: Transaction, activity: Activity, players: Players[]) {
    try {
        if (!activity.forwarder) {
            console.info("Details of forwarder contract are missing");
            return;
        }
        // Decoded forwarded event to get player address, contract and data
        const decoded = decodeTransactionInput(transaction.input, activity.forwarder!.abi, activity.forwarder!.address);

        const player_address: string = decoded['0']['from'].toLowerCase();
        const contract: string = decoded['0']['to'].toLowerCase();
        const data: string = decoded['0']['data'];

        // If contract is not for event end
        if (contract !== activity.address.toLowerCase()) {
            console.info("The event does not belong to activity", activity.id, "activity address =>", activity.address, "event contract =>", contract);
            return;
        }

        // If player not participating in activity end
        const foundPlayer = players.find((p) => p.operator === player_address || p.address === player_address);
        if (!foundPlayer) {
            console.info("Event does not include player for activity", activity.id, "detected player =>", player_address);
            return;
        }

        // Decode forwarded event data to check if correct method
        const decoded_event = decodeTransactionInput(data, activity.abi, activity.address);
        const method = (decoded_event["__method__"]) as string;

        if (!method.includes(activity.functionName)) {
            console.info("Event is for a different function", activity.id, "activity function =>", activity.functionName, "detected function =>", method, "found player address =>", foundPlayer.address);
            return;
        }

        // If corret send reward
        await _processFoundTransaction(
            player_address,
            activity,
            players,
            foundPlayer,
            transaction,
            decoded_event
        );
    } catch (err) {
        console.error("Could not process forwarded event", err);
    }
}

export async function _processFoundTransaction(decodedPlayer: string, activity: Activity, players: Players[], foundPlayer: Players, transaction: Transaction, decodedEvent: Record<string, any>) {
    try {
        let foundPlayerAddress = decodedPlayer;

        // Check if the event with the player has the additional information needed
        const additionalInformationNeeded = true;
        if (additionalInformationNeeded === true) {
            const methodDataAttributeName = "transformInstanceEntities";
            const methodData = decodedEvent[methodDataAttributeName];
            const wantedData = "";
            if (methodData) {
                // check if data is array or not
                if (Array.isArray(methodData)) {
                    let found = false;
                    for (let data of methodData) {
                        if (data === methodData) {
                            found = true;
                            break;
                        }
                    }

                    if (found == false) {
                        console.info("The wanted data", wantedData, "was not found in decoded data", decodedEvent);
                        return;
                    }
                } else {
                    if (wantedData !== methodData) {
                        console.info("The wanted data", wantedData, "was not found in decoded data", decodedEvent);
                        return;
                    }
                }
            } else {
                console.info("Could not decode method data needed for additional checks", decodedEvent, "method data wanted", methodDataAttributeName);
                return;
            }
        }

        if (Number.isNaN(activity.found[decodedPlayer]) || activity.found[decodedPlayer] === undefined) {
            console.log("Decoded player not in found");
            // This means that decodedPlayer is the players address and not the operator address
            const player = players.find((p) => p.address === decodedPlayer);
            if (player) {
                console.log("Found player =>", player);
                foundPlayerAddress = player?.operator ?? "";
            }
        }
        activity.found[foundPlayerAddress] += 1;

        console.log(`Transaction for ${decodedPlayer} in activity ${activity.id} found ${activity.found[foundPlayerAddress]} times with goal ${activity.goal}`);

        // Update contract
        let updateHash = NO_TRANSACTION;
        if (activity.reward) {
            console.log("Contract called");
            updateHash = await smartContract.updatePoints(
                activity.id,
                foundPlayer.address.toLowerCase(),
                1
            );
        }

        await db.insert(type1foundTransactions).values({
            txHash: transaction.hash,
            activity_id: activity.id,
            playerAddress: foundPlayer.address.toLowerCase(),
            update_tx_hash: updateHash
        });

        if (activity.found[foundPlayerAddress] >= activity.goal) {
            console.log("ALERT!");
            // Remove player
            const playerIndex = players.indexOf(foundPlayer);
            players.splice(playerIndex, 1);

            // Update Worx
            let worx_id = "";
            try {
                if (foundPlayer.worx_id) {
                    worx_id = await sendWorxNotification({
                        worx_id: foundPlayer.worx_id,
                        milestone_id: activity.id,
                        reward: activity.reward
                    })
                }
            } catch (err) {
                console.log("Update worx failed", err);
            }

            await db.update(activityPlayers).set({
                done: true,
                worxUpdateID: worx_id
            }).where(and(eq(activityPlayers.activityId, activity.id), eq(activityPlayers.playerAddress, foundPlayer.address)));

            // Remove player from found
            delete activity.found[foundPlayerAddress];
        }
    } catch (err) {
        console.error("Could not process the found transcation", err);
    }
}

function getListOfWantedData(decoded: Record<string, any>, y_loc_string: string): any[] {
    try {
        const levels = isMultiLevelFunction(y_loc_string);
        if (levels.length === 1) {
            const decoded_item = decoded[levels[0]];
            if (decoded_item) {
                if (Array.isArray(decoded_item)) {
                    return decoded_item;
                } else {
                    return [decoded_item];
                }
            } else {
                return [];
            }
        } else {
            let data: any[] = [decoded];
            for (const l of levels) {
                const temp_data: any[] = [];
                for (const d of data) {
                    const value = d[l];
                    if (Array.isArray(value)) {
                        temp_data.push(...value);
                    } else {
                        temp_data.push(value);
                    }
                }

                data = temp_data;
            }

            return data;
        }
    } catch(err) {
        console.info("Error getting wanted data", err);
        return []
    }
}

(() => {
    const decoded = decodeTransactionInput(
        "0x152bf612000000000000000000000000000000000000000000000000000000000000002091e28d9e62e964581c495b1d09605c645c9690e46de057075318b00a254c899e000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020001142d0000000000013bf15246d9d77db64802909731a6753b3bed5817611200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000",
        [{ "inputs": [{ "internalType": "address", "name": "caller", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "CallerNotOwner", "type": "error" }, { "inputs": [], "name": "EmptyTransformArray", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "expected", "type": "uint256" }, { "internalType": "uint256", "name": "actual", "type": "uint256" }], "name": "InputLengthMismatch", "type": "error" }, { "inputs": [], "name": "InvalidERC20Input", "type": "error" }, { "inputs": [], "name": "InvalidERC721Input", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "gameRegistry", "type": "address" }], "name": "InvalidGameRegistry", "type": "error" }, { "inputs": [], "name": "InvalidInputTokenType", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "transformInstanceEntity", "type": "uint256" }, { "internalType": "uint16", "name": "numSuccess", "type": "uint16" }, { "internalType": "uint16", "name": "maxSuccess", "type": "uint16" }], "name": "InvalidNumSuccess", "type": "error" }, { "inputs": [], "name": "InvalidRandomWord", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "runnerEntity", "type": "uint256" }], "name": "InvalidRunner", "type": "error" }, { "inputs": [], "name": "MissingInputsOrOutputs", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "bytes32", "name": "expectedRole", "type": "bytes32" }], "name": "MissingRole", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "transformEntity", "type": "uint256" }], "name": "NoTransformRunners", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "tokenContract", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "NotOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "expected", "type": "address" }, { "internalType": "address", "name": "actual", "type": "address" }], "name": "TokenContractNotMatching", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "expected", "type": "uint256" }, { "internalType": "uint256", "name": "actual", "type": "uint256" }], "name": "TokenIdNotMatching", "type": "error" }, { "inputs": [{ "internalType": "enum ILootSystemV2.LootType", "name": "expected", "type": "uint8" }, { "internalType": "enum ILootSystemV2.LootType", "name": "actual", "type": "uint8" }], "name": "TokenTypeNotMatching", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "transformEntity", "type": "uint256" }], "name": "TransformNotAvailable", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "transformInstanceEntity", "type": "uint256" }], "name": "TransformNotCompleteable", "type": "error" }, { "inputs": [], "name": "ZeroParamCount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8" }], "name": "Initialized", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [{ "internalType": "uint256[]", "name": "transformInstanceEntities", "type": "uint256[]" }], "name": "batchCompleteTransform", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "transformInstanceEntity", "type": "uint256" }], "name": "completeTransform", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "transformInstanceEntity", "type": "uint256" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "completeTransformWithAccount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getGameRegistry", "outputs": [{ "internalType": "contract IGameRegistry", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "gameRegistryAddress", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "components": [{ "internalType": "uint256", "name": "transformEntity", "type": "uint256" }, { "components": [{ "internalType": "enum ILootSystemV2.LootType", "name": "lootType", "type": "uint8" }, { "internalType": "uint256", "name": "lootEntity", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ILootSystemV2.Loot[]", "name": "inputs", "type": "tuple[]" }, { "internalType": "uint16", "name": "count", "type": "uint16" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct TransformParams", "name": "params", "type": "tuple" }], "name": "isTransformAvailable", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "transformInstanceEntity", "type": "uint256" }], "name": "isTransformCompleteable", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "forwarder", "type": "address" }], "name": "isTrustedForwarder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "requestId", "type": "uint256" }, { "internalType": "uint256", "name": "randomNumber", "type": "uint256" }], "name": "randomNumberCallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "gameRegistryAddress", "type": "address" }], "name": "setGameRegistry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "shouldPause", "type": "bool" }], "name": "setPaused", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "transformEntity", "type": "uint256" }, { "components": [{ "internalType": "enum ILootSystemV2.LootType", "name": "lootType", "type": "uint8" }, { "internalType": "uint256", "name": "lootEntity", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ILootSystemV2.Loot[]", "name": "inputs", "type": "tuple[]" }, { "internalType": "uint16", "name": "count", "type": "uint16" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct TransformParams", "name": "params", "type": "tuple" }], "name": "startTransform", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "transformEntity", "type": "uint256" }, { "components": [{ "internalType": "enum ILootSystemV2.LootType", "name": "lootType", "type": "uint8" }, { "internalType": "uint256", "name": "lootEntity", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct ILootSystemV2.Loot[]", "name": "inputs", "type": "tuple[]" }, { "internalType": "uint16", "name": "count", "type": "uint16" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct TransformParams", "name": "params", "type": "tuple" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "startTransformWithAccount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }],
        "0xe6Cc6541A4A406DC5d310e4C8a72CC72d23757ef"
    );
    const wantedData = getListOfWantedData(decoded, "params->inputs->lootEntity");
    console.log(wantedData);
    process.exit(0);
})();