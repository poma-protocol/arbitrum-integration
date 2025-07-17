import { Router } from "express";
import { Errors, MyError } from "../helpers/errors";
import { createActivity, joinActivity } from "../helpers/types";
import { activityPlayers, games, type1Activities, type1ActivityInstructions, type1Challenges } from "../db/schema";
import { db } from "../db/pool";
import { Success } from "../helpers/success";
import { eq, sql } from "drizzle-orm";
import smartContract from "../smartcontract";
import database from "../database";
import { getBattleStatistics } from "../controller/statistics/battle";
import getMilestonePlayers from "../controller/battle/get_players";
import isMaximumExistingMilestonePlayersReached from "../controller/battle/is_maximum_players_reached";
import shouldUserJoinBeSentToContract from "../controller/battle/should_join_sent_contract";
import { NO_TRANSACTION } from "../helpers/constants";
import { isAddress } from "web3-validator";
import activityController from "../controller/activity";
import activityModel from "../database/activity";
import { formatDate } from "../helpers/formatters";

const router: Router = Router();

router.post("/create", async (req, res) => {
    try {
        const parsed = createActivity.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;

            // Get game ID
            const gameID = await db.select({
                id: type1Challenges.gameID,
                name: games.name
            }).from(type1Challenges)
                .leftJoin(games, eq(type1Challenges.gameID, games.id))
                .where(eq(type1Challenges.id, data.challenge_id));

            // Create activity on DB
            const insertedID = await db.insert(type1Activities).values({
                goal: data.goal,
                name: data.name,
                challenge_id: data.challenge_id,
                reward: data.reward,
                image: data.image,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                maximum_number_players: data.maximum_num_players,
                about: data.about
            }).returning({ id: type1Activities.id });

            if (data.instructions) {
                for (let i of data.instructions) {
                    // insert instructions
                    await db.insert(type1ActivityInstructions).values({
                        activity_id: insertedID[0].id,
                        instruction: i
                    });
                }
            }

            let txHash = NO_TRANSACTION;
            try {
                // Storing in contarct
                if (data.reward) {
                    txHash = await smartContract.createActivity(
                        insertedID[0].id,
                        gameID[0].id,
                        data.goal,
                        gameID[0].name!,
                        data.reward
                    )
                }
            } catch (err) {
                // Delete db entry
                await db.delete(type1Activities).where(eq(type1Activities.id, insertedID[0].id));
                console.log(err);

                if (data.instructions) {
                    // Delete instructions
                    await db.delete(type1ActivityInstructions).where(eq(type1ActivityInstructions.activity_id, insertedID[0].id))
                }

                // throw error
                throw err;
            }

            // Update activity with transaction hash
            await db.update(type1Activities).set({
                creation_tx_hash: txHash
            }).where(eq(type1Activities.id, insertedID[0].id));

            res.status(201).json({ id: insertedID[0].id });
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

            const playerAddressValid = isAddress(data.player_address);
            if (!playerAddressValid) {
                res.status(400).json({error: [Errors.PLAYER_ADDRESS_NOT_VALID]});
                return;
            }

            if (data.operator_address) {
                const operatorAddressValid = isAddress(data.operator_address);
                if (!operatorAddressValid) {
                    res.status(400).json({error: [Errors.OPERATOR_ADDRESS_NOT_VALID]});
                    return;
                }
            }

            // Check if activity exists
            const battleExists = await database.doesBattleExist(data.activity_id);
            if (!battleExists) {
                res.status(400).json({ error: [Errors.MILESTONE_NOT_EXIST] });
                return;
            }

            // Check if maximum number of players had been reached
            const isMaximum = await isMaximumExistingMilestonePlayersReached(data.activity_id);
            if (isMaximum) {
                res.status(400).json({ error: [Errors.MAXIMUM_NUMBER_PLAYERS_REACHED] })
                return;
            }

            // Check if player already joined
            const playerAlready = await database.isPlayerInBattle(data.activity_id, data.player_address);
            if (playerAlready) {
                res.status(400).json({ error: [Errors.PLAYER_ALREADY_IN_BATTLE] });
            }

            const shouldUpdateContract = await shouldUserJoinBeSentToContract(data.activity_id);
            let txHash = NO_TRANSACTION;
            if (shouldUpdateContract) {
                // Store on contract
                txHash = await smartContract.addParticipant(
                    data.activity_id,
                    data.player_address.toLowerCase()
                );
            }

            await db.insert(activityPlayers).values({
                activityId: data.activity_id,
                playerAddress: data.player_address.toLowerCase(),
                bubbleID: data.bubble_id,
                creation_tx_hash: txHash,
                operator_address: data.operator_address?.toLowerCase()
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
            reward: number | null,
            goal: number,
            image: string,
            startDate: string,
            endDate: string,
            type: "milestone" | "jackpot" | "record" | "tournament"
            players: number
        }[] = [];
        for (const activity of activities) {
            const count = await db.select({
                count: sql<number>`cast(count(*) as int)`
            }).from(activityPlayers)
                .where(eq(activityPlayers.activityId, activity.id));

            toReturn.push({
                ...activity,
                type: "milestone",
                players: count[0].count,
                startDate: formatDate(activity.startDate),
                endDate: formatDate(activity.endDate)
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
            endDate: type1Activities.endDate,
            about: type1Activities.about
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

        // Get instructions
        const instructions = await db.select({
            instruction: type1ActivityInstructions.instruction
        }).from(type1ActivityInstructions)
            .where(eq(type1ActivityInstructions.activity_id, activity[0].id));

        const toReturn = {
            ...activity[0],
            players: count[0].count,
            instructions: instructions.length > 0 ? instructions.map((i) => i.instruction) : []
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
            if (err.message === Errors.MILESTONE_NOT_EXIST) {
                res.status(400).json({ error: [Errors.MILESTONE_NOT_EXIST] });
                return;
            }
        }

        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/milestone/players/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const players = await getMilestonePlayers(id, database);
        res.json(players);
    } catch (err) {
        if (err instanceof MyError) {
            if (err.message === Errors.MILESTONE_NOT_EXIST) {
                res.status(400).json({ error: [err.message] });
                return;
            }
        }

        console.log("Error getting milestone players", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/featured", async (req , res) => {
    try {
        const featured = await activityController.getFeaturedActivities(activityModel);
        res.json(featured);
    } catch(err) {
        console.error("Error getting featured activities", err);
        res.status(500).json({message: Errors.INTERNAL_SERVER_ERROR});
    }
})

export default router;
