import { z } from "zod";

export const createMessageInputSchema = z.object({
    message: z.string(),
    chatId: z.string()
});

export const getMessagesByChatIdInputSchema = z.object({
    chatId: z.string()
})

export const getChatByBatchIdInputSchema = z.object({
    batchId: z.string()
})