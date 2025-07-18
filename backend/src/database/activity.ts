import { and, count, desc, sql } from "drizzle-orm";

import { db } from "../db/pool";
import { activityPlayers, games, type1Activities, type1Challenges } from "../db/schema";
import { eq } from "drizzle-orm";
import { FilteredActivity } from "../helpers/types";

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

const PAGE_SIZE = 6;

enum RewardFilter {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

const LOW_REWARD = 0.00001;
const MEDIUM_REWARD = 0.0001;
const HIGH_REWARD = 0.001;

export enum ActivityStatus {
    UPCOMING = "upcoming",
    COMPLETED = "completed",
    ACTIVE = "active"
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

    async filterMilestones(args: FilteredActivity): Promise<RawDealCardDetails[]> {
        try {
            let minimumReward: number = 0;
            if (args.rewards) {
                if (args.rewards === RewardFilter.LOW) {
                    minimumReward = LOW_REWARD;
                } else if (args.rewards === RewardFilter.MEDIUM) {
                    minimumReward = MEDIUM_REWARD;
                } else {
                    minimumReward = HIGH_REWARD;
                }
            }

            const today = new Date();

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
            .innerJoin(type1Challenges, eq(type1Activities.challenge_id, type1Challenges.id))
            .innerJoin(games, eq(type1Challenges.gameID, games.id))
            .where(
                sql`
                    ${args.category ?? null}::text IS NULL OR ${games.category} = ${args.category ?? null}
                    AND (${args.game ?? null}::text IS NULL OR ${games.name} = ${args.game ?? null})
                    AND (${args.rewards ?? null}::text IS NULL OR ${type1Activities.reward} >= ${minimumReward})
                    AND (${args.status ?? null}::text IS NULL OR ${args.status ?? null} = ${ActivityStatus.ACTIVE} AND ${type1Activities.startDate} < ${today} AND ${type1Activities.endDate} > ${today} OR ${args.status ?? null} = ${ActivityStatus.COMPLETED} AND ${type1Activities.endDate} < ${today} OR ${args.status ?? null} = ${ActivityStatus.UPCOMING} AND ${type1Activities.startDate} > ${today})
                    AND(${args.search ?? null}::text IS NULL OR (${type1Activities.name} LIKE ${args.search ?? null} OR ${games.name} LIKE ${args.search ?? null} OR ${type1Challenges.name} LIKE ${args.status ?? null}))
                    AND ${type1Activities.done} = false
                `,
            )
            .orderBy(desc(type1Activities.reward))
            .groupBy(type1Activities.id, activityPlayers.activityId)
            .offset((args.page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

            return rawActivities;
        } catch(err) {
            console.error("Error filtering milestone activities", err);
            throw new Error("Could not filter milestone activities");
        }
    }
}

const activityModel = new ActivityModel();
export default activityModel;