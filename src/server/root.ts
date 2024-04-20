import { type TRPCContext, createCallerFactory, createTRPCRouter } from "@/server/trpc";
import { batchRouter } from "./routers/batch";
import { stripeRouter } from "./routers/stripe";
import { userToBatchRouter } from "./routers/userToBatch";
import { batchContributionRouter } from "./routers/batchContribution";
import { type inferRouterOutputs } from "@trpc/server";
import { batchRegisterRouter } from "./routers/batchRegister";
import { batchRequestRouter } from "./routers/batchRequest";
import { withdrawalsRouter } from "./routers/withdrawals";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  batch: batchRouter,
  stripe: stripeRouter,
  userToBatch: userToBatchRouter,
  batchContribution: batchContributionRouter,
  batchRegisters: batchRegisterRouter,
  batchRequest: batchRequestRouter,
  withdrawal: withdrawalsRouter,
});

export const createCaller = (ctx: TRPCContext) => {
  const caller = createCallerFactory(appRouter);
  return caller(ctx);
}

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
