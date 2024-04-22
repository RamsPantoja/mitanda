import { z } from "zod";
import { batchRequestStatusEnum, batchRequestTypeEnum } from "../db/schema";

export const startBatchRequestInputSchema = z.object({
    participantIds: z.array(z.string()).min(1),
    batchId: z.string(),
});

export const whereBatchRequestInputSchema = z.object({
    type: z.enum(batchRequestTypeEnum.enumValues).optional(),
    status: z.enum(batchRequestStatusEnum.enumValues).optional(),
    batchId: z.string(),
});

export const checkStartBatchRequestInputSchema = z.object({
    batchRequestId: z.string(),
    batchId: z.string(),
    participantIds: z.array(z.string())
});