import { Router } from "express";
import { Errors, MyError } from "../helpers/errors";
import { createJackpotSchema, joinJackpotSchema } from "../helpers/types";
import { createJackpot } from "../controller/jackpot/create";
import database from "../database";
import { Success } from "../helpers/success";
import { joinJackpot } from "../game/joinJackpot";
const router: Router = Router();

router.post("/create", async (req, res) => {
    try {
        const parsed = createJackpotSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await createJackpot(data, database);
            res.status(201).json({message: Success.JACKPOT_CREATED});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        res.status(500).json({error: [Errors.INTERNAL_SERVER_ERROR]});
    }
});

router.post("/join", async (req, res) => {
    try {
        const parsed = joinJackpotSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await joinJackpot(data.jackpot_id, data.player_address, database);
            res.status(201).json({message: Success.JACKPOT_JOINED});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.JACKPOT_NOT_EXIST) {
                res.status(400).json({error: [err.message]});
            }
        }
        res.status(500).json({message: [Errors.INTERNAL_SERVER_ERROR]});
    }
})

export default router;