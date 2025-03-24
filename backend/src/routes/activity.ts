import { Router } from "express";
import { Errors, MyError } from "../helpers/errors";
import { createActivity, joinActivity } from "../helpers/types";
import { activityPlayers, contracts, type1Activities, type1Challenges } from "../db/schema";
import { db } from "../db/pool";
import { Success } from "../helpers/success";
import { eq, sql } from "drizzle-orm";
import smartContract from "../smartcontract";
import database from "../database";
import { getBattleStatistics } from "../controller/statistics/battle";

const router: Router = Router();

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
            }).returning({ id: type1Activities.id });

            let txHash = "";
            try {
                // Storing in contarct
                txHash = await smartContract.createActivity(
                    insertedID[0].id,
                    gameID[0].id,
                    data.goal,
                    gameID[0].name!,
                    data.reward
                )
            } catch (err) {
                // Delete db entry
                await db.delete(type1Activities).where(eq(type1Activities.id, insertedID[0].id));
                console.log(err);

                // throw error
                throw err;
            }

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

            // Check if activity exists
            const battleExists = await database.doesBattleExist(data.activity_id);
            if (!battleExists) {
                res.status(400).json({ error: [Errors.BATTLE_NOT_EXIST] });
                return;
            }

            // Check if player already joined
            const playerAlready = await database.isPlayerInBattle(data.activity_id, data.player_address);
            if (playerAlready) {
                res.status(400).json({ error: [Errors.PLAYER_ALREADY_IN_BATTLE] });
            }

            // Store on contract
            const txHash = await smartContract.addParticipant(
                data.activity_id,
                data.player_address.toLowerCase()
            );

            await db.insert(activityPlayers).values({
                activityId: data.activity_id,
                playerAddress: data.player_address.toLowerCase(),
                creation_tx_hash: txHash
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
            res.status(400).json({ error: [Errors.INVALID_ACTIVITY_ID] });
            return;
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
            res.status(404).json({ error: [Errors.ACTIVITY_NOT_FOUND] });
            return;
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

router.get("/statistics/:id", async (req, res) => {
    try {
        const battleID = Number.parseInt(req.params.id);
        const statistics = await getBattleStatistics(battleID, database);
        res.status(200).json(statistics);
    } catch (err) {
        if (err instanceof MyError) {
            if (err.message === Errors.BATTLE_NOT_EXIST) {
                res.status(400).json({ error: [Errors.BATTLE_NOT_EXIST] });
                return;
            }
        }

        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
})

export default router;
