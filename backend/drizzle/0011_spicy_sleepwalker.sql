ALTER TABLE "type_1_activities" ADD COLUMN "start_date" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD COLUMN "end_date" date DEFAULT now() NOT NULL;