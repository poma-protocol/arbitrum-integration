CREATE TABLE "jackpotActivity" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"requirement" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reward" real NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jackpotActivity" ADD CONSTRAINT "jackpotActivity_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE no action ON UPDATE no action;