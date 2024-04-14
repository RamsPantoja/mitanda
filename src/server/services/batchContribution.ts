import { type TRPCContext } from "../trpc";
import { type batchContributions } from "../db/schema";

type BatchContributionServiceContructor = {
    ctx: TRPCContext
}

export type BatchContribution = typeof batchContributions.$inferSelect;

class BatchContributionService {
    ctx: TRPCContext

    constructor({ ctx }: BatchContributionServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default BatchContributionService;