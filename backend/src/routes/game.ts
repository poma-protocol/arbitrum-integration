import { Router } from "express";
import { Errors, MyError } from "../helpers/errors";
import { createChallengeSchema, registerGameSchema } from "../helpers/types";
import { db } from "../db/pool";
import { games, type1Challenges } from "../db/schema";
import { Success } from "../helpers/success";
const router: Router = Router();
import { eq } from "drizzle-orm";
import multer from "multer";
import database from "../database";
import battleChallengeController from "../controller/challenges/battle";
import gameController from "../controller/game";
const upload = multer({dest: "uploads/"});

router.post("/upload", upload.single("image"), (req, res) => {
    try {
        if(!req.file) {
            res.status(400).json({error: [Errors.IMAGE_UPLOAD_FAILED]});
        }
        res.status(201).json(req.file!.path);
    } catch(err) {
        console.log("Error Uploading Image ->", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.post("/challenge/battle", async (req, res) => {
    try {
        const parsed = createChallengeSchema.safeParse(req.body);
        if (parsed.success) {
            const args = parsed.data;
            const createdChallengeID = await battleChallengeController.create(args);
            res.status(201).json({message: Success.CHALLENGE_CREATED, challenge_id: createdChallengeID});
        } else {    
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.GAME_NOT_EXIST || err.message === Errors.FORWARDER_ADDRESS_NOT_VALID || err.message === Errors.CONTRACT_ADDRESS_NOT_VALID) {
                res.status(400).json({error: [err.message]});
                return;
            }
        }

        console.log("Error creating challenge", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
})

router.post("/register", async (req, res) => {
    try {
        const parsed = registerGameSchema.safeParse(req.body);
        if (parsed.success) {
            // Storing contract details
            const data = parsed.data
            const gameID = await gameController.create(data);

            res.status(201).json({gameid: gameID});
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
        const retrievedGames = await db.select({
            id: games.id,
            name: games.name,
            image: games.image,
            category: games.category
        }).from(games);

        res.status(200).json(retrievedGames);
    } catch(err) {
        console.log("Error Getting Games =>", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("/:category", async (req, res) => {
    try {
        const category = req.params.category;

        const retrievedGames = await db.select({
            id: games.id,
            name: games.name,
            image: games.image,
            category: games.category
        }).from(games)
        .where(eq(games.category, category));

        res.status(200).json(retrievedGames);
    } catch(err) {
        console.log("Error Getting Games =>", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await db.selectDistinct({
            category: games.category
        }).from(games).orderBy(games.category);

        const categs = categories.map((category) => category.category);
        res.status(200).json(categs);
    } catch(err) {  
        console.log("Error Getting Game Categories", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("/challenges/:id", async (req, res) => {
    try {
        const gameID = Number.parseInt(req.params.id);
        const challenges = await db.select({
            id: type1Challenges.id,
            name: type1Challenges.name
        }).from(type1Challenges)
            .where(eq(type1Challenges.gameID, gameID));

        res.status(200).json(challenges);
    } catch(err) {
        console.log("Error Getting Challenges => ", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.get("/battles/:gameid", async (req, res) => {
    try {
        const gameID = Number.parseInt(req.params.gameid);
        const activities = await database.getBattlesFromGame(gameID);
        res.status(200).json(activities);
    } catch(err) {
        console.log("Error getting activities from game", err);
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
})

router.get("*", (req, res) => {
    res.status(404).json({error: [Errors.ROUTE_NOT_FOUND]});
})


export default router;