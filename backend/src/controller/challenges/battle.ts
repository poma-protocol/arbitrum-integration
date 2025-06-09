import database from "../../database";
import { Errors, MyError } from "../../helpers/errors";
import { CreateChallengeType } from "../../helpers/types";
import { isAddress } from "web3-validator";

class BattleChallengeController {
    async create(args: CreateChallengeType): Promise<number> {
        try {
            const contractAddressValid = isAddress(args.contract_address);
            if (!contractAddressValid) {
                throw new MyError(Errors.CONTRACT_ADDRESS_NOT_VALID);
            }

            if (args.forwarderAddress) {
                const forwarderAddressValid = isAddress(args.forwarderAddress);
                if (!forwarderAddressValid) {
                    throw new MyError(Errors.FORWARDER_ADDRESS_NOT_VALID);
                }
            }
            // Throw error if game does not exist
            const doesGameExist = await database.doesGameIDExist(args.gameID);
            if (!doesGameExist) {
                throw new MyError(Errors.GAME_NOT_EXIST);
            }

            // Create challenge
            const challenge_id = await database.createChallenge(args);
            return challenge_id;
        } catch (err) {
            console.error("Error creating challenge", err);
            throw new MyError("Error creating challenge");
        }
    }
}

const battleChallengeController = new BattleChallengeController();
export default battleChallengeController;