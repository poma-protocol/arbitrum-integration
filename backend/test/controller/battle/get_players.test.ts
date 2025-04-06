import getMilestonePlayers from "../../../src/controller/battle/get_players";
import { Errors, MyError } from "../../../src/helpers/errors";
import { mockDatabase } from "../../mocks";

describe("Get Milestone Players Test", () => {
    const nonExistingID = 1000;
    const existingID = 1;
    const players = ["test"];
    const rewarded_players = ["test"];

    beforeAll(async () => {
        mockDatabase.doesBattleExist = jest.fn().mockImplementation(id => {
            return new Promise((res, rej) => {
                if (id === existingID) {
                    res(true);
                } else if (id === nonExistingID) {
                    res(false);
                }

                rej("Unknown");
            })
        });

        mockDatabase.getExistingMilestonePlayers = jest.fn().mockImplementation(id => {
            return new Promise((res, rej) => {
                if (id === existingID) {
                    res({
                        players,
                        rewarded_players
                    });
                }

                rej("Unknown");
            })
        })
    });

    it("should fail if the milestone does not exist", async () => {
        try {
            await getMilestonePlayers(nonExistingID, mockDatabase);
            console.log("Expected error but didn't get");
            expect(false).toBe(true);
        } catch(err) {
            if (err instanceof MyError) {
                if (err.message === Errors.MILESTONE_NOT_EXIST) {
                    expect(true).toBe(true);
                } else {
                    console.log("Unexpected error");
                    expect(false).toBe(true);
                }
            } else {
                console.log("Unexpected error", err);
                expect(false).toBe(true);
            }
        }
    });

    it("should return players for existing milestone", async () => {
        const result = await getMilestonePlayers(existingID, mockDatabase);
        expect(result).toEqual({
            players,
            rewarded_players
        })
    })
});