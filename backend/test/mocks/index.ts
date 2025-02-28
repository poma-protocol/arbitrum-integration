import { MyDatabase } from "../../src/database";

export const mockDatabase = {
    storeJackpot: jest.fn(),
    doesBattleExist: jest.fn(),
    getExistingBattleRewardGiven: jest.fn(),
    getNumberOfBattlePlayers: jest.fn(),
    enterPlayerInRaffle: jest.fn(),
    markJackpotAsCompleted: jest.fn(),
    markJackpotPlayerFound: jest.fn(),
    doesJackpotExist: jest.fn(),
    addPlayerToJackpot: jest.fn()
} as MyDatabase