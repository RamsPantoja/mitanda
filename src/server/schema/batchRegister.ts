import { z } from 'zod'

export const updateWithdrawalContributionAmountInput = z.object({ 
    withdrawalId: z.string().optional()
})