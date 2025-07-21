CREATE TABLE "operatoraddresses" (
	"useraddress" text NOT NULL,
	"gameid" integer NOT NULL,
	"operatoraddress" text NOT NULL,
	CONSTRAINT "operatoraddresses_useraddress_gameid_pk" PRIMARY KEY("useraddress","gameid")
);
--> statement-breakpoint
ALTER TABLE "operatoraddresses" ADD CONSTRAINT "operatoraddresses_gameid_games_id_fk" FOREIGN KEY ("gameid") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;