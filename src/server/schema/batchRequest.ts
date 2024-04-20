import { z } from "zod";
import { batchRequestTypeEnum } from "../db/schema";

export const createBatchRequestInputSchema = z.object({
    participantIds: z.array(z.string()).min(1),
    batchId: z.string(),
    type: z.enum(batchRequestTypeEnum.enumValues),
});