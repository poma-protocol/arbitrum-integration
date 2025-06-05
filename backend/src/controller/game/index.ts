import { db } from "../../db/pool";
import { games } from "../../db/schema";
import { MyError } from "../../helpers/errors";
import { RegisterGameType } from "../../helpers/types";
import battleChallengeController from "../challenges/battle";

class GameController {
    async create(args: RegisterGameType): Promise<number> {
        try {
            const insertedGame = await db.insert(games)
                .values({
                    name: args.name,
                    category: args.category,
                    image: args.image
                }).returning({ id: games.id });

            const gameID = insertedGame[0].id;

            // Storing challenges in game
            for (let challenge of args.challenges) {
                await battleChallengeController.create({...challenge, gameID});
            }

            return gameID;
        } catch (err) {
            console.error("Error registering game", err);
            throw new MyError("Error registering game");
        }
    }
}

const gameController = new GameController();
export default gameController;