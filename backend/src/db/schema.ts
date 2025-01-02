import { primaryKey } from "drizzle-orm/mysql-core";
import { boolean, integer, json, pgTable, serial, text } from "drizzle-orm/pg-core";

export const contracts = pgTable("contracts", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    abi: json("ABI").notNull(),
    image: text("image").notNull(),
    category: text("category").notNull(),
});

export const type1Challenges = pgTable("type_1_challenges", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    functionName: text("function_name").notNull(),
    playerAddressVariable: text("player_address_variable").notNull(),
    contractID: integer("contractID").references(() => contracts.id).notNull()
});

export const type1Activities = pgTable("type_1_activities", {
    id: serial("id").primaryKey(),
    goal: integer("goal").notNull(),
    name: text("name").notNull(),
    challenge_id: integer("challenge_id").references(() => type1Challenges.id).notNull(),
    reward: integer("reward").notNull(),
    onChainID: integer("on_chain_id").notNull(),
    done: boolean("done").default(false).notNull()
});

export const activityPlayers = pgTable("activity_players", {
    activityId: integer("activity_id").references(() => type1Activities.id),
    playerAddress: text("player_address").notNull(),
    done: boolean("done").default(false).notNull()
}, (table) => {
    return [{
        pk: primaryKey({columns: [activityPlayers.activityId, activityPlayers.playerAddress]}),
        pkWithCustomName: primaryKey({ name: 'player_activity', columns: [activityPlayers.activityId, activityPlayers.playerAddress] }),
    }];
});

export const type1foundTransactions = pgTable("type_1_found_transactions", {
    id: serial("id").primaryKey(),
    txHash: text("tx_hash").notNull(),
    activity_id: integer("activity_id").references(() => type1Activities.id).notNull(),
    playerAddress: text("player_address").notNull()
})
