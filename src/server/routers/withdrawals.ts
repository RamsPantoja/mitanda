import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createWithdrawalInput } from "../schema/withdrawal";

export const withdrawalsRouter = createTRPCRouter({
  createWithdrawalLog: protectedProcedure
  .input(createWithdrawalInput)
    .mutation(async ({ ctx, input }) => {
      return true
    })//TODO develop services to do the mutation 
})