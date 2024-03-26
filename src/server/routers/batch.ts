import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { batchesInputSchema, createBatchInputSchema, deleteBatchInputSchema, ownBatchesInputSchema, stripeTestInputSchema } from "../schema/batch";

export const batchRouter = createTRPCRouter({
  stripeTest: protectedProcedure
    .input(stripeTestInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.stripeTest(input.name)
    }),
  create: protectedProcedure
    .input(createBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.create(input, ctx.session);
    }),
  ownBatches: protectedProcedure
    .input(ownBatchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.ownBatches(input.where, ctx.session);
    }),
  batches: protectedProcedure
    .input(batchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.batches(input.where, ctx.session);
    }),
  delete: protectedProcedure
    .input(deleteBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.delete(input.batchId, ctx.session);
    })
});
