import { getParticipantsFromBatchInputSchema } from "../schema/userToBatch";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userToBatchRouter = createTRPCRouter({
    getParticipantsFromBatch: protectedProcedure
        .input(getParticipantsFromBatchInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).userToBatch.getParticipantsFromBatch(input.batchId);
        }),
});