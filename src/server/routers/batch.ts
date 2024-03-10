import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/trpc";

export const batchRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.services.batchService.create(5, input.name);
    }),
});
