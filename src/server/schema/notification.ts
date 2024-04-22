import { z } from "zod";

export const markAsSeenInputSchema = z.object({
    notificationId: z.string()
})

export const notificationsByUserInputSchema = z.object({
    userId: z.string()
})