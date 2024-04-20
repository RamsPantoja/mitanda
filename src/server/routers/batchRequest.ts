import { createBatchRequestInputSchema } from '../schema/batchRequest';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const batchRequestRouter = createTRPCRouter({
    create: protectedProcedure
        .input(createBatchRequestInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).batchRequestService.create(input);
        })
});