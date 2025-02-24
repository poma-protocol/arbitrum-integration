ALTER TABLE "activity_players" ADD COLUMN "createdTransactionHash" text;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD COLUMN "creationTransactionHash" text;--> statement-breakpoint
ALTER TABLE "type_1_activities" DROP COLUMN "on_chain_id";