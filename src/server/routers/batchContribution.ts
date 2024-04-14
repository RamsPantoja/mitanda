import { getBatchContributionsInputSchema } from "../schema/batchContribution";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const batchContributionRouter = createTRPCRouter({
    getBatchContributions: protectedProcedure
        .input(getBatchContributionsInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).batchContribution.getBatchContributions(input);
        }),
});