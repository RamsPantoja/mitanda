import { z } from "zod";
import { frequencyEnum } from "../db/schema";

export const createBatchInputSchema = z.object({
  batchInput: z.object({
    name: z.string(),
    contributionAmount: z.number(),
    seats: z.number(),
    frequency: z.enum(frequencyEnum.enumValues)
  })
});

export const whereInputBatchSchema = z.object({
  name: z.string()
});

export const ownBatchesInputSchema = z.object({
  where: whereInputBatchSchema
});

export const batchesInputSchema = z.object({
  where: whereInputBatchSchema
});

export const deleteBatchInputSchema = z.object({
  batchId: z.string({
    required_error: "BatchId is required"
  })
});

export const batchByIdInputSchema = z.object({
  batchId: z.string({
    required_error: "BatchId is required"
  })
});