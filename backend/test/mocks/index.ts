import { MyDatabase } from "../../src/database";

export const mockDatabase = {
    storeJackpot: jest.fn(),
    doesBattleExist: jest.fn(),
    getExistingBattleRewardGiven: jest.fn(),
    getNumberOfBattlePlayers: jest.fn()
} as MyDatabase