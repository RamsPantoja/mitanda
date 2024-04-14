import { z } from "zod";

export const getBatchContributionsInputSchema = z.object({
    where: z.object({
        batchId: z.string().optional(),
        batchRegisterId: z.string().optional(),
        userId: z.string().optional(),
    })
});