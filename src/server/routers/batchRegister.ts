import { createTRPCRouter, protectedProcedure } from '../trpc';

export const batchRegisterRouter = createTRPCRouter({
  searchEnableWithdrawals: protectedProcedure
  .query( async ({ctx}) => {
    return await ctx.services({ctx}).batchRegisterService.searchEnableWithdrawals(ctx.session)
  })
})