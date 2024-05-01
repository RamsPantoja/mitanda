import { createFeedbackInputSchema } from "../schema/feedback";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const feedbackRouter = createTRPCRouter({
    createFeedback: protectedProcedure
        .input(createFeedbackInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).feedbackService.create({
                createFeedbackInputSchema: input,
                session: ctx.session
            });
        }),
});