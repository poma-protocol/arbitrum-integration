import {z} from "zod";
import { Errors } from "./errors";

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);
export const registerGameSchema = z.object({
    contract_address: z.string({message: Errors.CONTRACT_ADDRESS}),
    abi: jsonSchema,
    challenges: z.object({
        player_address_variable: z.string({message: Errors.PLAYER_ADDRESS_VARIABLE}),
        function_name: z.string({message: Errors.FUNCTION_NAME})
    }).array()
})