import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import { stripePaymentProcessInput, stripeRelationIdInputSchema } from "../schema/stripe";
import type Stripe from "stripe";

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
    }),
  createStripeDashboardLink: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.services({ ctx }).stripeService.createStripeDshboardLink(ctx.session)
    }),
  paymentProcess: publicProcedure
    .input(stripePaymentProcessInput)
    .mutation(async ({ ctx, input }) => {

      return await ctx.services({ ctx }).stripeService.processPayment({
        data: {
          metadata: input.metadata as Stripe.Metadata,
          id: input.id,
          amount: input.amount
        },
        batchService: ctx.services({ ctx }).batchService
      })
    })

})
