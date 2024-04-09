import { z } from 'zod'

export const stripeRelationIdInputSchema = z.object({
  accountId: z.string()
});

export const stripeItemSchema = z.object({
  unitPrice: z.number({
    required_error: "unitPrice is required"
  }),
  quantity: z.number({
    required_error: "quantity is required"
  }),
  concept: z.string({
    required_error: "concept is required"
  })
});