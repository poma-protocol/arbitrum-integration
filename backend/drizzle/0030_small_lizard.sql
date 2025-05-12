ALTER TABLE "jackpot_players" DROP CONSTRAINT "jackpot_players_jackpot_id_jackpotActivity_id_fk";
--> statement-breakpoint
ALTER TABLE "jackpot_players" ADD CONSTRAINT "jackpot_players_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE cascade ON UPDATE no action;