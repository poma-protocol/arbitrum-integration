import { GamesModel } from "../../database/games";
import { db } from "../../db/pool";
import { games } from "../../db/schema";
import { MyError } from "../../helpers/errors";
import { formatDate } from "../../helpers/formatters";
import { FilterGames, RegisterGameType } from "../../helpers/types";
import { DEFAULT_FILTER_VALUE, DEFAULT_SEARCH_VALUE } from "../activity";
import battleChallengeController from "../challenges/battle";

interface GameDetails {
    id: number,
    name: string,
    category: string,
    image: string,
    challenges: number,
    activeBattles: number,
    totalPlayers: number,
    createdAt: string
}

interface GameChallenges {
    id: number,
    name: string,
    function_name: string,
    player_address_variable: string,
    countItems: boolean,
    battles: number
}

interface Game {
    name: string,
    image: string,
    category: string,
    createdAt: string
}

class GameController {
    async create(args: RegisterGameType): Promise<number> {
        try {
            const insertedGame = await db.insert(games)
                .values({
                    name: args.name,
                    category: args.category,
                    image: args.image,
                    adminId: args.adminId
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

    async filter(args: FilterGames, gamesModel: GamesModel): Promise<GameDetails[]> {
        try {
            const sanitizedArgs: FilterGames = {adminId: args.adminId};
            sanitizedArgs.category = args.category === DEFAULT_FILTER_VALUE || args.category === undefined ? undefined : args.category;
            sanitizedArgs.search = args.search === DEFAULT_SEARCH_VALUE || args.search === undefined ? undefined : args.search;
            const filteredGames = await gamesModel.filter(sanitizedArgs);
            const games: GameDetails[] = [];

            for (const game of filteredGames) {
                const createdAt = formatDate(game.createdAt);

                games.push({
                    ...game,
                    createdAt
                });
            }

            return games;
        } catch(err) {
            console.error("Error filtering games", err);
            throw new Error("Error filtering games");
        }
    }

    async getChallenges(id: number, gamesModel: GamesModel): Promise<GameChallenges[]> {
        try {
            const challenges = await gamesModel.getChallenges(id);
            return challenges;
        } catch(err) {
            console.error("Error getting challenges for games", err);
            throw new Error("Error getting game's challenges");
        }
    }

    async get(id: number, gamesModel: GamesModel): Promise<Game | null> {
        try {
            const game = await gamesModel.get(id);
            
            if (game) {
                return {...game, createdAt: formatDate(game.createdAt)};
            } else {
                return null;
            }
        } catch(err) {
            console.error("Error getting game", err);
            throw new Error("Error getting game");
        }
    }
}

const gameController = new GameController();
export default gameController;