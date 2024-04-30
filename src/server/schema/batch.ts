import { z } from "zod";
import { frequencyEnum, paymentCaseEnum } from "../db/schema";
import { stripeItemSchema } from "./stripe";

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

export const userToBatchInputSchema = z.object({
  batchId: z.string({
    required_error: "BatchId is required"
  })
});

export const startBatchInputSchema = z.object({
  batchId: z.string({
    required_error: "BatchId is required"
  }),
  participantIds: z.array(z.string())
});

export const finishBatchInputSchema = z.object({
  batchId: z.string({
    required_error: "BatchId is required"
  })
});

const metadataSchema = z.object({
  userId: z.string().optional(),
  paymentCase: z.enum(paymentCaseEnum.enumValues),
  batchData: z.object({
    name: z.string(),
    contributionAmount: z.number(),
    seats: z.number(),
    frequency: z.enum(frequencyEnum.enumValues)
  }).transform((object) => JSON.stringify(object))
});

export const batchPaymentLinkInputSchema = z.object({
  data: z.object({
    items: z.array(stripeItemSchema),
    currency: z.string(),
    cancelUrl: z.string(),
    successUrl: z.string(),
    metadata: metadataSchema
  })
});

export const addBatchContributionInputSchema = z.object({
  userId: z.string(),
  batchRegisterId: z.string(),
  batchId: z.string()
});