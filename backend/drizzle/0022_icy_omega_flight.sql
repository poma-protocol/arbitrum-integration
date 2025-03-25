CREATE TABLE "type_1_activity_instructions" (
	"activity_id" integer NOT NULL,
	"instruction" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "type_1_activities" ADD COLUMN "about" text;--> statement-breakpoint
ALTER TABLE "type_1_activity_instructions" ADD CONSTRAINT "type_1_activity_instructions_activity_id_type_1_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."type_1_activities"("id") ON DELETE no action ON UPDATE no action;