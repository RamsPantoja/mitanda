import { z } from "zod";

export const  createWithdrawalInput = z.object({
  userId: z.string(),
  batchId: z.string(),
  batchRegisterId: z.string(),
  amount: z.string()
})