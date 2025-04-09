import { count, eq } from "drizzle-orm";
import { db } from "../../db/pool";
import { activityPlayers, type1Activities } from "../../db/schema";
import { Errors, MyError } from "../../helpers/errors";

export default async function isMaximumExistingMilestonePlayersReached(milestone_id: number): Promise<boolean> {
    try {
        // Get number of players
        const num_players = await db.select({
            count: count(),
        }).from(activityPlayers)
        .where(eq(activityPlayers.activityId, milestone_id));

        // Get maximum number of players
        const maximum_players = await db.select({
            maximum: type1Activities.maximum_number_players
        }).from(type1Activities)
        .where(eq(type1Activities.id, milestone_id));

        // Compare
        if (maximum_players[0].maximum) {
            return maximum_players[0].maximum <= num_players[0].count
        } else {
            return false;
        }
    } catch(err) {
        console.log("Error checking if maximum number of players reached", err);
        throw new MyError(Errors.NOT_CHECK_MAXIMUM_NUM_PLAYETS);
    }
}