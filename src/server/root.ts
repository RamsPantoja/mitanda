import { createTRPCRouter } from "@/server/trpc";
import { batchRouter } from "./routers/batch";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  batch: batchRouter,
  stripe: stripeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
