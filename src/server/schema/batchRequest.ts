import { z } from "zod";

export const startBatchRequestInputSchema = z.object({
    participantIds: z.array(z.string()).min(1),
    batchId: z.string(),
});