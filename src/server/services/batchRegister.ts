import { type TRPCContext } from "../trpc";

type BatchRegisterServiceContructor = {
    ctx: TRPCContext
}

class BatchRegisterService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRegisterServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default BatchRegisterService;