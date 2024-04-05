import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc";
import { stripeRelationIdInputSchema } from "../schema/stripe";

export const stripeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.stripeService.createStripeAccount(input, ctx.session)
    }),
  find: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.services.stripeService.stripeAccountByUserId(ctx.session)
    }),
  createStripeAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.services.stripeService.stripeAccountFlow(ctx.session)
    }),
  newAccountLink: protectedProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.stripeService.newAccountLink(input.accountId)
    }),
  updateOnboarding: publicProcedure
  .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.stripeService.updateOnboarding(input.accountId)
    })

})
