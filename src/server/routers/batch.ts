import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { createBatchInputSchema, ownBatchesInputSchema } from "../schema/batch";

export const batchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.create(input, ctx.session)
    }),
  ownUserBatches: protectedProcedure
    .input(ownBatchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.ownUserBatches(input.where, ctx.session)
    })
});
