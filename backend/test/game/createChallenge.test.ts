import { createChallenge } from "../../src/game/createChallenge";
import { Errors, MyError } from "../../src/helpers/errors";
import { CreateChallenge } from "../../src/helpers/types";
import { mockDatabase } from "../mocks";

describe("Create Challenge Test", () => {
    const nonExistentContractID = 1000;
    const existingContractID = 1;

    beforeAll(async () => {
        mockDatabase.doesContractIDExist = jest.fn().mockImplementation((contract_id) => {
            return new Promise((res, rej) => {
                if (contract_id === nonExistentContractID) {
                    res(false);
                } else if (contract_id === existingContractID) {
                    res(true);
                } else {
                    rej("Wrong");
                }
            })
        })
    })
    it("should throw error if contract does not exist", async () => {
        try {
            const args: CreateChallenge = {
                contractID: nonExistentContractID,
                player_address_variable: "test",
                function_name: "test",
                name: "test"
            };

            await createChallenge(args, mockDatabase);
            console.log("Expected an error");
            expect(false).toBe(true);
        } catch(err) {
            if (err instanceof MyError) {
                if (err.message === Errors.CONTRACT_NOT_EXIST) {
                    expect(true).toBe(true);
                } else {
                    console.log("Unexpected error =>", err);
                    expect(false).toBe(true);
                }
            } else {
                console.log("Unexpected error =>", err);
                expect(false).toBe(true);
            }
        }
    });

    it("should create challenge", async () => {
        const args: CreateChallenge = {
            contractID: existingContractID,
            player_address_variable: "test",
            function_name: "test",
            name: "test"
        };

        await createChallenge(args, mockDatabase);
        expect(mockDatabase.createChallenge).toHaveBeenCalledTimes(1);
        expect(mockDatabase.createChallenge).toHaveBeenCalledWith(args);
    })
})