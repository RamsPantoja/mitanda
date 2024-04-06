import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { batchByIdInputSchema, batchesInputSchema, createBatchInputSchema, deleteBatchInputSchema, ownBatchesInputSchema, startBatchInputSchema, userToBatchInputSchema } from "../schema/batch";

export const batchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.create(input, ctx.session);
    }),
  ownBatches: protectedProcedure
    .input(ownBatchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.ownBatches(input.where, ctx.session);
    }),
  batches: protectedProcedure
    .input(batchesInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.batches(input.where, ctx.session);
    }),
  delete: protectedProcedure
    .input(deleteBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.delete(input.batchId, ctx.session);
    }),
  batchById: protectedProcedure
    .input(batchByIdInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.batchById(input.batchId, ctx.session);
    }),
  addUserToBatch: protectedProcedure
    .input(userToBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.addUserToBatch(input.batchId, ctx.session);
    }),
  startBatch: protectedProcedure
    .input(startBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.startBatch(input.batchId);
    }),
});
