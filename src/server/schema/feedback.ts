import { z } from "zod";

export const createFeedbackInputSchema = z.object({
    content: z.string(),
});