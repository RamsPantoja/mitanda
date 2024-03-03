import { type Config } from "drizzle-kit";
import { env } from "@/env";


export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./src/server/drizzle",
  dbCredentials: {
    connectionString: env.DATABASE_URL
  },
} satisfies Config;