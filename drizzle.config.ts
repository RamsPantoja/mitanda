import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/server/db/schema.ts",
  out: "./src/server/drizzle",
  dbCredentials: {
    url: env.DATABASE_URL
  }
});