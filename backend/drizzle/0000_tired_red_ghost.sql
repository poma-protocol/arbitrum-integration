CREATE TABLE "activity_players" (
	"activity_id" integer NOT NULL,
	"player_address" text NOT NULL,
	"bubbleID" text,
	"done" boolean DEFAULT false NOT NULL,
	"worx_update_id" text,
	"createdTransactionHash" text,
	"owner_address" text,
	CONSTRAINT "activity_players_activity_id_player_address_pk" PRIMARY KEY("activity_id","player_address")
);
--> statement-breakpoint
CREATE TABLE "game_admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"category" text NOT NULL,
	"creationTime" timestamp DEFAULT now() NOT NULL,
	"admin_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jackpotActivity" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"requirement" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reward" real NOT NULL,
	"player_awarded" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jackpot_found_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_hash" text NOT NULL,
	"jackpot_id" integer NOT NULL,
	"player_address" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jackpot_players" (
	"jackpot_id" integer,
	"player_address" text NOT NULL,
	"met_requirement" boolean DEFAULT false NOT NULL,
	CONSTRAINT "jackpot_players_jackpot_id_player_address_pk" PRIMARY KEY("jackpot_id","player_address")
);
--> statement-breakpoint
CREATE TABLE "operatoraddresses" (
	"useraddress" text NOT NULL,
	"gameid" integer NOT NULL,
	"operatoraddress" text NOT NULL,
	CONSTRAINT "operatoraddresses_useraddress_gameid_pk" PRIMARY KEY("useraddress","gameid")
);
--> statement-breakpoint
CREATE TABLE "type_1_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"goal" integer NOT NULL,
	"name" text NOT NULL,
	"challenge_id" integer NOT NULL,
	"reward" real NOT NULL,
	"creationTransactionHash" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"image" text NOT NULL,
	"about" text,
	"done" boolean DEFAULT false NOT NULL,
	"maximum_number_players" integer NOT NULL,
	"admin_id" integer
);
--> statement-breakpoint
CREATE TABLE "type_1_activity_instructions" (
	"activity_id" integer NOT NULL,
	"instruction" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_1_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contract_address" text NOT NULL,
	"ABI" json NOT NULL,
	"function_name" text NOT NULL,
	"player_address_variable" text NOT NULL,
	"gameID" integer NOT NULL,
	"use_forwader" boolean DEFAULT false NOT NULL,
	"forwarder_address" text,
	"forwarder_abi" json,
	"method_data_attribute_name" text,
	"wanted_data" text,
	"count_items" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_1_found_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_hash" text NOT NULL,
	"activity_id" integer NOT NULL,
	"player_address" text NOT NULL,
	"updateTransactionHash" text
);
--> statement-breakpoint
ALTER TABLE "activity_players" ADD CONSTRAINT "activity_players_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_admin_id_game_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."game_admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpotActivity" ADD CONSTRAINT "jackpotActivity_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpot_found_transactions" ADD CONSTRAINT "jackpot_found_transactions_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpot_players" ADD CONSTRAINT "jackpot_players_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operatoraddresses" ADD CONSTRAINT "operatoraddresses_gameid_games_id_fk" FOREIGN KEY ("gameid") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD CONSTRAINT "type_1_activities_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD CONSTRAINT "type_1_activities_admin_id_game_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."game_admins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activity_instructions" ADD CONSTRAINT "type_1_activity_instructions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD CONSTRAINT "type_1_challenges_gameID_games_id_fk" FOREIGN KEY ("gameID") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_found_transactions" ADD CONSTRAINT "type_1_found_transactions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;