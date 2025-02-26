import { primaryKey } from "drizzle-orm/mysql-core";
import { boolean, date, integer, json, pgTable, real, serial, text } from "drizzle-orm/pg-core";

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
    reward: real("reward").notNull(),
    creation_tx_hash: text("creationTransactionHash"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    image: text("image").notNull(),
    done: boolean("done").default(false).notNull()
});

export const activityPlayers = pgTable("activity_players", {
    activityId: integer("activity_id").references(() => type1Activities.id),
    playerAddress: text("player_address").notNull(),
    done: boolean("done").default(false).notNull(),
    creation_tx_hash: text("createdTransactionHash")
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
    playerAddress: text("player_address").notNull(),
    update_tx_hash: text("updateTransactionHash")
});

export const jackpotActivity = pgTable("jackpotActivity", {
    id: serial("id").primaryKey(),
    challenge_id: integer("challenge_id").references(() => type1Challenges.id).notNull(),
    requirement: integer("requirement").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    reward: real("reward").notNull()
});
