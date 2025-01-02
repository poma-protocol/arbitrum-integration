import {Router} from "express";
import { Errors } from "../helpers/errors";
import { createActivity, joinActivity } from "../helpers/types";
import { activityPlayers, contracts, type1Activities, type1Challenges } from "../db/schema";
import { db } from "../db/pool";
import { Success } from "../helpers/success";
import { eq } from "drizzle-orm";
import smartContract from "../smartcontract";

const router = Router();

router.post("/create", async (req, res) => {
    try {        
        const parsed = createActivity.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;

            // Get game ID
            const gameID = await db.select({
                id: type1Challenges.contractID,
                name: contracts.name
            }).from(type1Challenges)
            .leftJoin(contracts, eq(type1Challenges.contractID, contracts.id))
            .where(eq(type1Challenges.id, data.challenge_id));

            // Storing in contarct
            const onchainID = await smartContract.createActivity(
                gameID[0].id,
                data.goal,
                gameID[0].name!,
                data.reward
            )

            // Storing activity
            await db.insert(type1Activities).values({
                goal: data.goal,
                name: data.name,
                challenge_id: data.challenge_id,
                reward: data.reward,
                onChainID: onchainID,
                image: data.image,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString()
            });

            res.status(201).json({message: Success.ACTIVITY_CREATED});
        } else {
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        console.log("Error Creating Activity =>", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]})
    }
});

router.post("/join", async(req, res) => {
    try {
        const parsed = joinActivity.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;

            // Store on contract
            await smartContract.addParticipant(
                data.activity_id,
                data.player_address
            );

            await db.insert(activityPlayers).values({
               activityId: data.activity_id,
               playerAddress: data.player_address.toLowerCase()
            });

            res.status(201).json({message: Success.ACTIVITY_JOINED});
        } else {
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {  
        console.log("Error Joining Activity", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("/", async (req, res) => {
    try {
        let activities = await db.select({
            id: type1Activities.id,
            name: type1Activities.name,
            reward: type1Activities.reward,
            goal: type1Activities.goal
        }).from(type1Activities);

        res.status(200).json(activities);
    } catch(err) {
        console.log("Error Getting Activities =>", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("*", (req, res) => {
    res.status(404).json({error: [
        Errors.ROUTE_NOT_FOUND
    ]})
})

export default router;
