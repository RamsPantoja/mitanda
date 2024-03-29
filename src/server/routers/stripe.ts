import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";
import { stripeRelationIdInputSchema } from "../schema/stripe";

export const stripeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(stripeRelationIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.stripeService.create(input, ctx.session)
    }),
  find: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.services.stripeService.userById(ctx.session)
    })

})
