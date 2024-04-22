import { checkStartBatchRequestInputSchema, startBatchRequestInputSchema, whereBatchRequestInputSchema } from '../schema/batchRequest';
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
        }),
    checkStartBatchRequest: protectedProcedure
        .input(checkStartBatchRequestInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).batchRequestService.checkStartBatchRequest({
                checkStartBatchRequestInputSchema: input,
                session: ctx.session,
                notificationService: ctx.services({ ctx }).notificationService,
                mailService: ctx.services({ ctx }).mailService,
            });
        })
});