import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { batchesInputSchema, createBatchInputSchema, ownBatchesInputSchema } from "../schema/batch";

export const batchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.create(input, ctx.session)
    }),
  ownBatches: protectedProcedure
    .input(ownBatchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.ownBatches(input.where, ctx.session)
    }),
  batches: protectedProcedure
    .input(batchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.batches(input.where, ctx.session)
    })
});
