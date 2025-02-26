import { mockDatabase } from "../../mocks";
import { createJackpot } from "../../../src/controller/jackpot/create";
import { CreateJackpot } from "../../../src/helpers/types";

describe("Create jackpot test", () => {
    it("should create jackpot in DB", async () => {
        try {
            let args: CreateJackpot = {
                requirement: 1,
                reward: 1,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                challenge_id: 1
            };

            await createJackpot(args, mockDatabase);
            expect(mockDatabase.storeJackpot).toHaveBeenCalledTimes(1);
            expect(mockDatabase.storeJackpot).toHaveBeenCalledWith(args);
        } catch(err) {
            console.log("Unexpected error in tests =>", err);
            expect(false).toBe(true);
        }
    });
})