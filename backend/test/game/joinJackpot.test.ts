import { joinJackpot } from "../../src/game/joinJackpot";
import { Errors, MyError } from "../../src/helpers/errors"
import { mockDatabase } from "../mocks";

describe("Join jackpot test", () => {
    it("should fail if jackpot does not exist", async () => {
        try {
            const nonExistentJackpot = 100;
            mockDatabase.doesJackpotExist = jest.fn().mockResolvedValue(false);

            await joinJackpot(nonExistentJackpot, "", mockDatabase);
            console.log("Expected error but didn't get any");
            expect(false).toBe(true);
        } catch (err) {
            if (err instanceof MyError) {
                if (err.message === Errors.JACKPOT_NOT_EXIST) {
                    expect(mockDatabase.addPlayerToJackpot).toHaveBeenCalledTimes(0);
                } else {
                    console.log("Unexpected error", err);
                    expect(false).toBe(true);
                }
            } else {
                console.log("Unexpected error", err);
                expect(false).toBe(true);
            }
        }
    });

    it("should add player to jackpot", async () => {
        const existingJackpotID = 1;
        const player_address = "test";
        mockDatabase.doesJackpotExist = jest.fn().mockResolvedValue(true);

        await joinJackpot(existingJackpotID, player_address, mockDatabase);
        expect(mockDatabase.addPlayerToJackpot).toHaveBeenCalledTimes(1);
        expect(mockDatabase.addPlayerToJackpot).toHaveBeenCalledWith(existingJackpotID, player_address);
    })
})