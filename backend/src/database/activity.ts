import { count, desc } from "drizzle-orm";

import { db } from "../db/pool";
import { activityPlayers, type1Activities } from "../db/schema";
import { eq } from "drizzle-orm";

export interface RawDealCardDetails {
    id: number;
    name: string;
    image: string;
    reward: number;
    playerCount: number;
    maxPlayers: number;
    startDate: Date;
    endDate: Date;
}

export class ActivityModel {
    async getFeaturedActivities(): Promise<RawDealCardDetails[]> {
        try {
            const rawActivities = await db.select({
                id: type1Activities.id,
                name: type1Activities.name,
                image: type1Activities.image,
                reward: type1Activities.reward,
                playerCount: count(activityPlayers),
                maxPlayers: type1Activities.maximum_number_players,
                startDate: type1Activities.startDate,
                endDate: type1Activities.endDate
            }).from(type1Activities)
            .leftJoin(activityPlayers, eq(activityPlayers.activityId, type1Activities.id))
            .where(eq(type1Activities.done, false))
            .orderBy(desc(type1Activities.reward))
            .groupBy(type1Activities.id, activityPlayers.activityId)
            .limit(3)

            return rawActivities;
        } catch(err) {
            console.error("Error getting featured deals from database", err);
            throw new Error("Error getting featured deals from database");
        }
    }
}

const activityModel = new ActivityModel();
export default activityModel;