ALTER TABLE "type_1_challenges" ADD COLUMN "use_forwader" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "forwarder_address" text;--> statement-breakpoint
ALTER TABLE "type_1_challenges" ADD COLUMN "forwarder_abi" json;