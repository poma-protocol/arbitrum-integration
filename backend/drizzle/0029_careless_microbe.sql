ALTER TABLE "activity_players" DROP CONSTRAINT "activity_players_activity_id_type_1_activities_id_fk";
--> statement-breakpoint
ALTER TABLE "jackpotActivity" DROP CONSTRAINT "jackpotActivity_challenge_id_type_1_challenges_id_fk";
--> statement-breakpoint
ALTER TABLE "jackpot_found_transactions" DROP CONSTRAINT "jackpot_found_transactions_jackpot_id_jackpotActivity_id_fk";
--> statement-breakpoint
ALTER TABLE "type_1_activities" DROP CONSTRAINT "type_1_activities_challenge_id_type_1_challenges_id_fk";
--> statement-breakpoint
ALTER TABLE "type_1_activity_instructions" DROP CONSTRAINT "type_1_activity_instructions_activity_id_type_1_activities_id_fk";
--> statement-breakpoint
ALTER TABLE "type_1_challenges" DROP CONSTRAINT "type_1_challenges_contractID_contracts_id_fk";
--> statement-breakpoint
ALTER TABLE "type_1_found_transactions" DROP CONSTRAINT "type_1_found_transactions_activity_id_type_1_activities_id_fk";
--> statement-breakpoint
ALTER TABLE "activity_players" ALTER COLUMN "activity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ALTER COLUMN "forwarder_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ALTER COLUMN "forwarder_abi" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_players" ADD CONSTRAINT "activity_players_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpotActivity" ADD CONSTRAINT "jackpotActivity_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jackpot_found_transactions" ADD CONSTRAINT "jackpot_found_transactions_jackpot_id_jackpotActivity_id_fk" FOREIGN KEY ("jackpot_id") REFERENCES "public"."jackpotActivity"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD CONSTRAINT "type_1_activities_challenge_id_type_1_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."type_1_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_activity_instructions" ADD CONSTRAINT "type_1_activity_instructions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD CONSTRAINT "type_1_challenges_contractID_contracts_id_fk" FOREIGN KEY ("contractID") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_1_found_transactions" ADD CONSTRAINT "type_1_found_transactions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE cascade ON UPDATE no action;