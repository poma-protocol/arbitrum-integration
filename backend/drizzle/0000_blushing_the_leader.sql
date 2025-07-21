CREATE TABLE "activity_players" (
	"activity_id" integer,
	"player_address" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"ABI" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_1_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"goal" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_1_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"function_name" text NOT NULL,
	"player_address_variable" text NOT NULL,
	"contractID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_1_found_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_hash" text NOT NULL,
	"activity_id" integer NOT NULL,
	"player_address" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_players" ADD CONSTRAINT "activity_players_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD CONSTRAINT "type_1_activities_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD CONSTRAINT "type_1_challenges_contractID_contracts_id_fk" FOREIGN KEY ("contractID") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_found_transactions" ADD CONSTRAINT "type_1_found_transactions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE no action ON UPDATE no action;