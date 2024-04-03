import {z} from 'zod'

export const getParticipantsFromBatchInputSchema = z.object({
  batchId: z.string()
})