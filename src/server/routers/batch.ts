import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { batchByIdInputSchema, batchesInputSchema, createBatchInputSchema, deleteBatchInputSchema, ownBatchesInputSchema, userToBatchInputSchema } from "../schema/batch";

export const batchRouter = createTRPCRouter({
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
    }),
  batchById: protectedProcedure
    .input(batchByIdInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services.batchService.batchById(input.batchId, ctx.session);
    }),
  addUserToBatch: protectedProcedure
    .input(userToBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.addUserToBatch(input.batchId, ctx.session);
    }),
});
