import {z} from 'zod'

export const stripeRelationIdInputSchema = z.object({
  accountId: z.string()
})