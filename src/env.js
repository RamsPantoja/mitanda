import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.string(),
    GOOGLE_CLIENT_ID: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_GOOGLE_CLIENT_ID_HERE"),
        "You forgot to add the google client ID"
      ),
    GOOGLE_CLIENT_SECRET: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_GOOGLE_CLIENT_SECRET"),
        "You forgot to add the google client secret"
      ),
    INVITE_LINK_SECRET: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_INVITE_LINK_SECRET"),
        "You forgot to add the invite link client secret"
      ),
    STRIPE_SECRET_KEY: z.string(),
    RESEND_KEY: z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_INVITE_LINK_SECRET: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_INVITE_LINK_SECRET: process.env.NEXT_PUBLIC_INVITE_LINK_SECRET,
    INVITE_LINK_SECRET: process.env.INVITE_LINK_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RESEND_KEY: process.env.RESEND_KEY
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
