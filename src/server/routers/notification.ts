import { notificationsByUserInputSchema } from "../schema/notification";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
    getBatchContributions: protectedProcedure
        .input(notificationsByUserInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).notificationService.getNotificationsByUserId(input.userId);
        }),
});