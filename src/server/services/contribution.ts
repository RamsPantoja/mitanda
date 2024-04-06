import { type TRPCContext } from "../trpc";

type ContributionServiceContructor = {
    ctx: TRPCContext
}

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