import { type TRPCContext } from "../trpc";
import { type contributions } from "../db/schema";

type ContributionServiceContructor = {
    ctx: TRPCContext
}

export type Contribution = typeof contributions.$inferSelect;

class ContributionService {
    ctx: TRPCContext

    constructor({ ctx }: ContributionServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default ContributionService;