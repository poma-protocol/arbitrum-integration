ALTER TABLE "type_1_activities" ALTER COLUMN "reward" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_activities" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "type_1_activities" ALTER COLUMN "end_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "type_1_activities" ALTER COLUMN "maximum_number_players" SET NOT NULL;