import { Router } from "express";
import { Errors } from "../helpers/errors";
import { registerGameSchema } from "../helpers/types";
import { db } from "../db/pool";
import { contracts, type1Challenges } from "../db/schema";
import { Success } from "../helpers/success";
const router = Router();

router.post("/register", async (req, res) => {
    try {
        const parsed = registerGameSchema.safeParse(req.body);
        if (parsed.success) {
            // Storing contract details
            const data = parsed.data
            const contractID = await db.insert(contracts)
                .values({
                    address: data.contract_address,
                    abi: data.abi,
                    name: data.name
                }).returning({id: contracts.id});

            // Storing challenges in game
            for (let challenge of data.challenges) {
                await db.insert(type1Challenges).values({
                    name: challenge.name,
                    functionName: challenge.function_name,
                    playerAddressVariable: challenge.player_address_variable,
                    contractID: contractID[0].id
                })
            }

            res.status(201).json({message: Success.GAME_REGISTERED})
        } else {
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({error: errors});
        }
        
    } catch(err) {
        console.log("Error Regisetering Game", err);
        res.status(500).json({error:[Errors.INTERNAL_SERVER_ERROR]})
    }
})

router.get("/", async (req, res) => {
    try {
        const games = await db.select({
            id: contracts.id,
            name: contracts.name
        }).from(contracts);

        res.status(200).json(games);
    } catch(err) {
        console.log("Error Getting Games =>", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
})

router.get("*", (req, res) => {
    res.status(404).json({error: [Errors.ROUTE_NOT_FOUND]});
})


export default router;