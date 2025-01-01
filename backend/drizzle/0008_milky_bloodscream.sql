ALTER TABLE "type_1_activities" ADD COLUMN "name" text DEFAULT '' NOT NULL;
ALTER TABLE "type_1_activities" ALTER COLUMN "name" DROP DEFAULT;

