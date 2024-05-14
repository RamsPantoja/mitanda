import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";

import {
  addBatchContributionInputSchema,
  batchByIdInputSchema,
  batchPaymentLinkInputSchema,
  batchesInputSchema,
  createBatchInputSchema,
  deleteBatchInputSchema,
  finishBatchInputSchema,
  ownBatchesInputSchema,
  startBatchInputSchema,
  userToBatchInputSchema,
  deleteUserFromBatchInputSchema
} from "../schema/batch";

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
  batchPaymentLink: protectedProcedure
    .input(batchPaymentLinkInputSchema)
    .mutation(async ({ ctx, input }) => {
      const services = ctx.services({ ctx });
      return await services.batchService.batchPaymentLink(input, services.stripeService);
    }),
  finishBatch: protectedProcedure
    .input(finishBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.finish(input.batchId);
    }),
  addBatchContribution: protectedProcedure
    .input(addBatchContributionInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.addBatchContribution(input);
    }),
  batchJoinInfo: protectedProcedure
    .input(batchByIdInputSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.joinToBatchInfo(input.batchId)
    }),
  startBatch: protectedProcedure
    .input(startBatchInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).batchService.startBatch({
        startBatchInputSchema: input,
        notificationService: ctx.services({ ctx }).notificationService,
        mailService: ctx.services({ ctx }).mailService,
      });
    }),
  needToPayForBatch: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.services({ ctx }).batchService.firstBatchByUserId(ctx.session.user.id);
    }),
    deleteUserFromBatch: protectedProcedure
    .input(deleteUserFromBatchInputSchema)
    .mutation(async ({ctx, input}) => {
      return await ctx.services({ctx}).batchService.deteleUserFromBatch(input.userId, input.batchId, input.contractId)
    })
});
