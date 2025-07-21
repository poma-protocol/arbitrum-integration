import { boolean, date, integer, json, pgTable, real, serial, text, primaryKey, timestamp } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    category: text("category").notNull(),
    createdAt: timestamp("creationTime").notNull().defaultNow()
});

export const type1Challenges = pgTable("type_1_challenges", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    contarct_address: text("contract_address").notNull(),
    abi: json("ABI").notNull(),
    functionName: text("function_name").notNull(),
    playerAddressVariable: text("player_address_variable").notNull(),
    gameID: integer("gameID").references(() => games.id, {onDelete: "cascade"}).notNull(),
    useForwarder: boolean("use_forwader").notNull().default(false),
    forwarderAddress: text("forwarder_address"),
    forwarderABI: json("forwarder_abi"),
    methodDataAttributeName: text("method_data_attribute_name"),
    wantedData: text("wanted_data"),
    countItems: boolean("count_items").notNull().default(false),
});

export const playerOperatorWalletTable = pgTable("operatoraddresses", {
    userAddress: text("useraddress").notNull(),
    gameID: integer("gameid").notNull().references(() => games.id, {onDelete: 'cascade'}),
    operatorAddress: text("operatoraddress").notNull()
}, (table) => [
    primaryKey({columns: [table.userAddress, table.gameID]})
]);

export const type1Activities = pgTable("type_1_activities", {
    id: serial("id").primaryKey(),
    goal: integer("goal").notNull(),
    name: text("name").notNull(),
    challenge_id: integer("challenge_id").references(() => type1Challenges.id, {onDelete: "cascade"}).notNull(),
    reward: real("reward").notNull(),
    creation_tx_hash: text("creationTransactionHash"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    image: text("image").notNull(),
    about: text("about"),
    done: boolean("done").default(false).notNull(),
    maximum_number_players: integer("maximum_number_players").notNull()
});

export const type1ActivityInstructions = pgTable("type_1_activity_instructions", {
    activity_id: integer("activity_id").notNull().references(() => type1Activities.id, {onDelete: "cascade"}),
    instruction: text("instruction").notNull()
})

export const activityPlayers = pgTable("activity_players", {
    activityId: integer("activity_id").references(() => type1Activities.id, {onDelete: "cascade"}).notNull(),
    playerAddress: text("player_address").notNull(),
    bubbleID: text("bubbleID"),
    done: boolean("done").default(false).notNull(),
    worxUpdateID: text("worx_update_id"),
    creation_tx_hash: text("createdTransactionHash"),
    operator_address: text("owner_address"),
}, (table) => [
    primaryKey({ columns: [table.activityId, table.playerAddress] }),
]);

export const type1foundTransactions = pgTable("type_1_found_transactions", {
    id: serial("id").primaryKey(),
    txHash: text("tx_hash").notNull(),
    activity_id: integer("activity_id").references(() => type1Activities.id, {onDelete: "cascade"}).notNull(),
    playerAddress: text("player_address").notNull(),
    update_tx_hash: text("updateTransactionHash")
});

export const jackpotFoundTransactions = pgTable("jackpot_found_transactions", {
    id: serial("id").primaryKey(),
    txHash: text("tx_hash").notNull(),
    jackpot_id: integer("jackpot_id").references(() => jackpotActivity.id, {onDelete: "cascade"}).notNull(),
    playerAddress: text("player_address").notNull(),
});

export const jackpotActivity = pgTable("jackpotActivity", {
    id: serial("id").primaryKey(),
    challenge_id: integer("challenge_id").references(() => type1Challenges.id, {onDelete: "cascade"}).notNull(),
    requirement: integer("requirement").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    reward: real("reward").notNull(),
    playerAwarded: boolean("player_awarded").notNull().default(false)
});

export const jackpotPlayers = pgTable("jackpot_players", {
    jackpot_id: integer("jackpot_id").references(() => jackpotActivity.id, {onDelete: "cascade"}),
    playerAddress: text("player_address").notNull(),
    met_requirement: boolean("met_requirement").notNull().default(false)
}, (table) => [
    primaryKey({ columns: [table.jackpot_id, table.playerAddress] }),
]);
