ALTER TABLE "type_1_challenges" ADD COLUMN "method_data_attribute_name" text;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "wanted_data" text;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "count_items" boolean DEFAULT false NOT NULL;