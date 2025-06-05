CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"category" text NOT NULL
);

DELETE FROM "type_1_challenges";
--> statement-breakpoint
ALTER TABLE "type_1_challenges" DROP CONSTRAINT "type_1_challenges_contractID_contracts_id_fk";
--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "contract_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "ABI" json NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "gameID" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD CONSTRAINT "type_1_challenges_gameID_games_id_fk" FOREIGN KEY ("gameID") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "contracts" DROP COLUMN "ABI";--> statement-breakpoint
ALTER TABLE "type_1_challenges" DROP COLUMN "contractID";