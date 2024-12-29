import {Router} from "express";
import { Errors } from "../helpers/errors";
import { createActivity, joinActivity } from "../helpers/types";
import { activityPlayers, type1Activities } from "../db/schema";
import { db } from "../db/pool";
import { Success } from "../helpers/success";

const router = Router();

router.post("/create", async (req, res) => {
    try {        
        const parsed = createActivity.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            // Storing activity
            await db.insert(type1Activities).values({
                goal: data.goal,
                challenge_id: data.challenge_id
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

            await db.insert(activityPlayers).values({
               activityId: data.activity_id,
               playerAddress: data.player_address 
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
})

router.get("*", (req, res) => {
    res.status(404).json({error: [
        Errors.ROUTE_NOT_FOUND
    ]})
})

export default router;