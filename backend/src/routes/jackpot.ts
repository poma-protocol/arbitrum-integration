import { Router } from "express";
import { Errors } from "../helpers/errors";
import { createJackpotSchema } from "../helpers/types";
import { createJackpot } from "../controller/jackpot/create";
import database from "../database";
import { Success } from "../helpers/success";
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

export default router;