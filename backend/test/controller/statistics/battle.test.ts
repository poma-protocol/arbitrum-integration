import { getBattleStatistics } from "../../../src/controller/statistics/battle";
import { Errors, MyError } from "../../../src/helpers/errors";
import { mockDatabase } from "../../mocks";

describe("Battle statistics test", () => {
    it("should fail if the battle does not exist", async () => {
        try {
            const nonExistentID = 100;
            mockDatabase.doesBattleExist = jest.fn().mockResolvedValue(false);

            await getBattleStatistics(nonExistentID, mockDatabase);
            console.log("Did not get an error as expected");
            expect(false).toBe(true);
        } catch (err) {
            if (err instanceof MyError) {
                if (err.message === Errors.MILESTONE_NOT_EXIST) {
                    expect(true).toBe(true);
                } else {
                    console.log("Unwanted error =>", err);
                    expect(false).toBe(true);
                }
            } else {
                console.log("Unwanted error =>", err);
                expect(false).toBe(true);
            }
        }
    });

    it("should return correct data if battle exists", async () => {
        const existingID = 1;
        const noplayers = 10;
        const rewards = 100;

        mockDatabase.doesBattleExist = jest.fn().mockResolvedValue(true);
        mockDatabase.getNumberOfBattlePlayers = jest.fn().mockResolvedValue(noplayers);
        mockDatabase.getExistingBattleRewardGiven = jest.fn().mockResolvedValue(rewards);

        const results = await getBattleStatistics(existingID, mockDatabase);
        expect(results).toEqual({ id: existingID, reward_given: rewards, no_players: noplayers });
    });
})