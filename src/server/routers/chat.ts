import { createMessageInputSchema, getChatByBatchIdInputSchema, getMessagesByChatIdInputSchema } from "../schema/chat";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
    createMessage: protectedProcedure
        .input(createMessageInputSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).chatService.createMessage(input, ctx.session);
        }),
    getMessagesByChatId: protectedProcedure
        .input(getMessagesByChatIdInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).chatService.getMessagesByChatId(input.chatId);
        }),
    chatByBatchId: protectedProcedure
        .input(getChatByBatchIdInputSchema)
        .query(async ({ ctx, input }) => {
            return await ctx.services({ ctx }).chatService.getChatByBatchId(input.batchId);
        })
});