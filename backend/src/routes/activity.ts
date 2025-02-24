import { Router } from "express";
import { Errors } from "../helpers/errors";
import { createActivity, joinActivity } from "../helpers/types";
import { activityPlayers, contracts, type1Activities, type1Challenges } from "../db/schema";
import { db } from "../db/pool";
import { Success } from "../helpers/success";
import { eq, sql } from "drizzle-orm";
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

            // Create activity on DB
            const insertedID = await db.insert(type1Activities).values({
                goal: data.goal,
                name: data.name,
                challenge_id: data.challenge_id,
                reward: data.reward,
                image: data.image,
                startDate: data.startDate,
                endDate: data.endDate
            }).returning({id: type1Activities.id});

            // Storing in contarct
            const txHash = await smartContract.createActivity(
                insertedID[0].id,
                gameID[0].id,
                data.goal,
                gameID[0].name!,
                data.reward
            )

            // Update activity with transaction hash
            await db.update(type1Activities).set({
                creation_tx_hash: txHash
            }).where(eq(type1Activities.id, insertedID[0].id));

            res.status(201).json({ message: Success.ACTIVITY_CREATED });
        } else {
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        console.log("Error Creating Activity =>", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] })
    }
});

router.post("/join", async (req, res) => {
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

            res.status(201).json({ message: Success.ACTIVITY_JOINED });
        } else {
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        console.log("Error Joining Activity", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/", async (req, res) => {
    try {
        const activities = await db.select({
            id: type1Activities.id,
            name: type1Activities.name,
            reward: type1Activities.reward,
            goal: type1Activities.goal,
            image: type1Activities.image,
            startDate: type1Activities.startDate,
            endDate: type1Activities.endDate
        }).from(type1Activities);

        const toReturn: {
            id: number,
            name: string,
            reward: number,
            goal: number,
            image: string,
            startDate: string,
            endDate: string,
            players: number
        }[] = [];
        for (const activity of activities) {
            const count = await db.select({
                count: sql<number>`cast(count(*) as int)`
            }).from(activityPlayers)
                .where(eq(activityPlayers.activityId, activity.id));
            
            toReturn.push({
                ...activity,
                players: count[0].count
            });
        }
        res.status(200).json(toReturn);
    } catch (err) {
        console.log("Error Getting Activities =>", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});
router.get("/one/:id", async (req, res) => {
    try {
        const activityId = parseInt(req.params.id);
        if (isNaN(activityId)) {
            return res.status(400).json({ error: [Errors.INVALID_ACTIVITY_ID] });
        }

        const activity = await db.select({
            id: type1Activities.id,
            name: type1Activities.name,
            reward: type1Activities.reward,
            goal: type1Activities.goal,
            image: type1Activities.image,
            startDate: type1Activities.startDate,
            endDate: type1Activities.endDate
        }).from(type1Activities)
            .where(eq(type1Activities.id, activityId))
            .limit(1);

        if (activity.length === 0) {
            return res.status(404).json({ error: [Errors.ACTIVITY_NOT_FOUND] });
        }

        const count = await db.select({
            count: sql<number>`cast(count(*) as int)`
        }).from(activityPlayers)
            .where(eq(activityPlayers.activityId, activityId));

        const toReturn = {
            ...activity[0],
            players: count[0].count
        };

        res.status(200).json(toReturn);
    } catch (err) {
        console.log("Error Getting Activity =>", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});
router.get("*", (req, res) => {
    res.status(404).json({
        error: [
            Errors.ROUTE_NOT_FOUND
        ]
    })
})

export default router;
