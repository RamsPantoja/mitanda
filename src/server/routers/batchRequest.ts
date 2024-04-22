import { startBatchRequestInputSchema, whereBatchRequestInputSchema } from '../schema/batchRequest';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const batchRequestRouter = createTRPCRouter({
    startBatchRequest: protectedProcedure
        .input(startBatchRequestInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).batchRequestService.start(
                input,
                ctx.services({ ctx }).mailService,
            );
        }),
    batchRequest: protectedProcedure
        .input(whereBatchRequestInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).batchRequestService.getBatchRequest(input);
        })
});