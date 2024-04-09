import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import { stripeRelationIdInputSchema } from "../schema/stripe";

export const stripeRouter = createTRPCRouter({
  createStripeAccount: protectedProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).stripeService.createStripeAccount(input, ctx.session)
    }),
    stripeAccountByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.services({ ctx }).stripeService.stripeAccountByUserId(ctx.session)
    }),
  stripeAccountFlow: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.services({ ctx }).stripeService.stripeAccountFlow(ctx.session)
    }),
  newAccountLink: protectedProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).stripeService.newAccountLink(input.accountId)
    }),
  updateOnboarding: publicProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services({ ctx }).stripeService.updateOnboarding(input.accountId)
    })

})
