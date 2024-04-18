import { createTRPCRouter, protectedProcedure } from '../trpc';
import { updateWithdrawalContributionAmountInput } from '../schema/batchRegister';

export const batchRegisterRouter = createTRPCRouter({
  searchEnableWithdrawals: protectedProcedure
  .query( async ({ctx}) => {
    return await ctx.services({ctx}).batchRegisterService.searchEnableWithdrawals(ctx.session)
  }),
  updateContributionAmount: protectedProcedure
  .input(updateWithdrawalContributionAmountInput)
  .mutation( async ({ctx, input}) => {
    return await ctx.services({ctx}).batchRegisterService.updateContributionAmount(ctx.session, input.withdrawalId!)
  }),
  
})