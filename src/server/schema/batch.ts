import { z } from "zod";
import { frequencyEnum } from "../db/schema";

export const createBatchInputSchema = z.object({
  batchInput: z.object({
    name: z.string(),
    contributionAmount: z.number(),
    seats: z.number(),
    frequency: z.enum(frequencyEnum.enumValues)
  })
})