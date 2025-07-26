import e, { Router } from "express";
import { Errors, MyError } from "../helpers/errors";
import { createChallengeSchema, filterGamesSchema, registerGameSchema } from "../helpers/types";
import { db } from "../db/pool";
import { games, type1Challenges } from "../db/schema";
import { Success } from "../helpers/success";
const router: Router = Router();
import { eq } from "drizzle-orm";
import multer from "multer";
import database from "../database";
import battleChallengeController from "../controller/challenges/battle";
import gameController from "../controller/game";
import gamesModel from "../database/games";
import { jwtBearer } from "../helpers/jwt-bearer";
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: [Errors.IMAGE_UPLOAD_FAILED] });
        }
        res.status(201).json(req.file!.path);
    } catch (err) {
        console.log("Error Uploading Image ->", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.post("/challenge/battle", async (req, res) => {
    try {
        const parsed = createChallengeSchema.safeParse(req.body);
        if (parsed.success) {
            const args = parsed.data;
            const createdChallengeID = await battleChallengeController.create(args);
            res.status(201).json({ message: Success.CHALLENGE_CREATED, challenge_id: createdChallengeID });
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        if (err instanceof MyError) {
            if (err.message === Errors.GAME_NOT_EXIST || err.message === Errors.FORWARDER_ADDRESS_NOT_VALID || err.message === Errors.CONTRACT_ADDRESS_NOT_VALID) {
                res.status(400).json({ error: [err.message] });
                return;
            }
        }

        console.log("Error creating challenge", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
})

router.post("/register", async (req, res) => {
    try {
        const payload = await jwtBearer.authenticate(req);
        if (!payload) {
            res.status(401).json({ error: [Errors.UNAUTHORIZED] });
            return;
        }
        const adminId = payload.userId;
        console.log("Admin ID =>", adminId);
        const parsed = registerGameSchema.safeParse({ ...req.body, adminId });
        if (parsed.success) {
            // Storing contract details
            const data = parsed.data
            const gameID = await gameController.create(data);

            res.status(201).json({ gameid: gameID });
        } else {
            console.log("Error Registering Game", parsed.error);
            const errors = parsed.error.issues.map((e) => e.message);
            res.status(400).json({ error: errors });
        }
    } catch (err) {
        console.log("Error Regisetering Game", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/", async (req, res) => {
    try {
        const retrievedGames = await db.select({
            id: games.id,
            name: games.name,
            image: games.image,
            category: games.category
        }).from(games);

        res.status(200).json(retrievedGames);
    } catch (err) {
        console.log("Error Getting Games =>", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/category/:category", async (req, res) => {
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
    } catch (err) {
        console.log("Error Getting Games =>", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const categories = await db.selectDistinct({
            category: games.category
        }).from(games).orderBy(games.category);

        const categs = categories.map((category) => category.category);
        res.status(200).json(categs);
    } catch (err) {
        console.log("Error Getting Game Categories", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/challenges/:id", async (req, res) => {
    try {
        const gameID = Number.parseInt(req.params.id);
        const challenges = await gameController.getChallenges(gameID, gamesModel);

        res.json(challenges);
    } catch (err) {
        console.log("Error Getting Challenges => ", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/battles/:gameid", async (req, res) => {
    try {
        const gameID = Number.parseInt(req.params.gameid);
        const activities = await database.getBattlesFromGame(gameID);
        res.status(200).json(activities);
    } catch (err) {
        console.log("Error getting activities from game", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/filter", async (req, res) => {
    try {
        const payload = await jwtBearer.authenticate(req);
        if (!payload) {
            const parsed = filterGamesSchema.safeParse(req.query);
            if (parsed.success) {
                const data = parsed.data;
                const games = await gameController.filter(data, gamesModel);
                console.log("Filtered Games =>", games);
                res.json(games);
            } else {
                const error = parsed.error.issues[0].message;
                res.status(400).json({ message: error });
                return;
            }
            return;
        }
        const adminId = payload.userId;
        const parsed = filterGamesSchema.safeParse({ ...req.query, adminId });
        console.log({ ...req.query, adminId });
        if (parsed.success) {
            const data = parsed.data;
            const games = await gameController.filter(data, gamesModel);
            console.log("Filtered Games =>", games);

            res.json(games);
        } else {
            const error = parsed.error.issues[0].message;
            res.status(400).json({ message: error });
            return;
        }
    } catch (err) {
        console.error("Error filtering games", err)
        res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR });
    }
});

router.get("admin-games/:adminId", async (req, res) => {
    try {
        const adminId = Number.parseInt(req.params.adminId);
        if (isNaN(adminId)) {
            res.status(400).json({ error: [Errors.GAME_ID] });
            return;
        }
        const games = await gamesModel.getGamesByAdmin(adminId);
        res.status(200).json(games);
    } catch (err) {
        console.error("Error getting games by admin", err);
        res.status(500).json({ error: [Errors.INTERNAL_SERVER_ERROR] });
    }
});

router.get("/game/:id", async (req , res) => {
    try {
        const gameID = Number.parseInt(req.params.id);
        const game = await gameController.get(gameID, gamesModel);
        res.json(game);
    } catch(err) {
        console.error("Error getting game", err);
        res.status(500).json({message: Errors.INTERNAL_SERVER_ERROR});
    }
})

router.get("*", (req, res) => {
    res.status(404).json({ error: [Errors.ROUTE_NOT_FOUND] });
})


export default router;