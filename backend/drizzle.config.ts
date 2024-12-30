import "dotenv/config";

if(!process.env.DATABASE_URL) {
    console.log("Set Database URL in env file");
    throw new MyError(Errors.SERVER_SETUP);
}

import { defineConfig } from "drizzle-kit";
import { Errors, MyError } from "./src/helpers/errors";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
});