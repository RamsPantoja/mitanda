import { type TRPCContext } from "../trpc";
import { type batchContributions } from "../db/schema";
import { type z } from "zod";
import { type getBatchContributionsInputSchema } from "../schema/batchContribution";
import { type User } from "./user";

type BatchContributionServiceContructor = {
    ctx: TRPCContext
}

export type BatchContribution = typeof batchContributions.$inferSelect;
type GetBatchContributionsInput = z.infer<typeof getBatchContributionsInputSchema>
export type BatchContributionWithUser = BatchContribution & { user: User };

class BatchContributionService {
    ctx: TRPCContext

    constructor({ ctx }: BatchContributionServiceContructor) {
        this.ctx = ctx;
    }

    public async getBatchContributions(input: GetBatchContributionsInput): Promise<BatchContributionWithUser[]> {
        const {
            where: {
                batchId,
                batchRegisterId,
                userId
            }
        } = input;

        const batchContributions = await this.ctx.db.query.batchContributions.findMany({
            where: (batchContributions, { eq, and }) => {
                return and(
                    batchId ? eq(batchContributions.batchId, batchId) : undefined,
                    batchRegisterId ? eq(batchContributions.batchRegisterId, batchRegisterId) : undefined,
                    userId ? eq(batchContributions.userId, userId) : undefined,
                )
            },
            with: {
                user: true
            }
        });

        return batchContributions;
    }
}

export default BatchContributionService;