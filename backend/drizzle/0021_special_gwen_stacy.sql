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
ALTER TABLE "jackpotActivity" ADD COLUMN "player_awarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "jackpot_found_transactions" ADD CONSTRAINT "jackpot_found_transactions_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpot_players" ADD CONSTRAINT "jackpot_players_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE no action ON UPDATE no action;