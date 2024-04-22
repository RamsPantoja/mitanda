import { notificationsByUserInputSchema } from "../schema/notification";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
    notificationsByUser: protectedProcedure
        .input(notificationsByUserInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).notificationService.getNotificationsByUserId(input.userId);
        }),
});