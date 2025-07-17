import { z } from "zod";
import { Errors } from "./errors";

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
    z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const createChallengeSchema = z.object({
    name: z.string({ message: Errors.CHALLENGE_NAME }),
    player_address_variable: z.string({ message: Errors.PLAYER_ADDRESS_VARIABLE }),
    function_name: z.string({ message: Errors.FUNCTION_NAME }),
    gameID: z.number({ message: Errors.GAME_ID }),
    useForwarder: z.boolean({ message: Errors.USE_FORWARDER }).default(false),
    forwarderAddress: z.string({ message: Errors.FORWARDER_ADDRESS }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Forwarder address must be a valid ethereum address"}).optional(),
    forwarderABI: jsonSchema.optional(),
    methodDataAttributeName: z.string({ message: Errors.METHOD_DATA_ATTRIBUTE_NAME }).optional(),
    wantedData: z.string({ message: Errors.WANTED_DATA }).optional(),
    countItems: z.boolean({ message: Errors.COUNT_ITEMS }).default(false),
    contract_address: z.string({ message: Errors.CONTRACT_ADDRESS }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Contract address must be a valid ethereum address"}),
    abi: jsonSchema,
});

export type CreateChallengeType = z.infer<typeof createChallengeSchema>

export const registerGameSchema = z.object({
    name: z.string({ message: Errors.GAME_NAME }),
    category: z.string({ message: Errors.GAME_CATEGORY }),
    image: z.string({ message: Errors.IMAGE }),
    challenges: z.array(z.object({
        name: z.string({ message: Errors.CHALLENGE_NAME }),
        player_address_variable: z.string({ message: Errors.PLAYER_ADDRESS_VARIABLE }),
        function_name: z.string({ message: Errors.FUNCTION_NAME }),
        useForwarder: z.boolean({ message: Errors.USE_FORWARDER }).default(false),
        forwarderAddress: z.string({ message: Errors.FORWARDER_ADDRESS }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Forwarder address must be a valid ethereum address"}).optional(),
        forwarderABI: jsonSchema.optional(),
        methodDataAttributeName: z.string({ message: Errors.METHOD_DATA_ATTRIBUTE_NAME }).optional(),
        wantedData: z.string({ message: Errors.WANTED_DATA }).optional(),
        countItems: z.boolean({ message: Errors.COUNT_ITEMS }).default(false),
        contract_address: z.string({ message: Errors.CONTRACT_ADDRESS }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Contract address must be a valid ethereum address"}),
        abi: jsonSchema,
    }))
});

export type RegisterGameType = z.infer<typeof registerGameSchema>;

export const createActivity = z.object({
    challenge_id: z.number({ message: Errors.CHALLENGE_ID }),
    goal: z.number({ message: Errors.ACTIVITY_GOAL }).gt(0, { message: Errors.ACTIVITY_GOAL }),
    reward: z.number({ message: Errors.REWARD }).gte(0.000001, { message: Errors.REWARD }),
    name: z.string({ message: Errors.ACTIVITY_NAME }),
    startDate: z.string({ message: Errors.ACTIVITY_START_DATE }),
    endDate: z.string({ message: Errors.ACTIVITY_END_DATE }),
    image: z.string({ message: Errors.IMAGE }),
    about: z.string({ message: Errors.INVALID_ABOUT }).optional(),
    instructions: z.array(z.string({ message: Errors.INVALID_INSTRUCTIONS })).optional(),
    maximum_num_players: z.number({ message: Errors.MAXIMUM_NUMBER_PLAYERS }).gt(0, { message: Errors.MAXIMUM_NUMBER_PLAYERS })
})

export const joinActivity = z.object({
    activity_id: z.number({ message: Errors.ACTIVITY_ID }),
    player_address: z.string({ message: Errors.PLAYER_ADDRESS }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Player address must be a valid ethereum address"}),
    bubble_id: z.string({ message: "Bubble ID should be a string" }),
    operator_address: z.string({ message: "Operator address must be a string" }).regex(/^(0x)?[0-9a-fA-F]{40}$/, {message: "Operator address must be a valid ethereum address"}).optional()
});

export const createJackpotSchema = z.object({
    challenge_id: z.number({ message: Errors.CHALLENGE_ID }),
    requirement: z.number({ message: Errors.JACKPOT_REQUIREMENT }).gt(0, { message: Errors.JACKPOT_REQUIREMENT }).int({ message: Errors.JACKPOT_REQUIREMENT }),
    startDate: z.string({ message: Errors.REWARD_START_DATE }),
    endDate: z.string({ message: Errors.REWARD_END_DATE }),
    reward: z.number({ message: Errors.REWARD }).gte(0.000001, { message: Errors.REWARD }),
});
export type CreateJackpot = z.infer<typeof createJackpotSchema>

export const joinJackpotSchema = z.object({
    jackpot_id: z.number({ message: Errors.JACKPOT_ID }),
    player_address: z.string({ message: Errors.PLAYER_ADDRESS })
});