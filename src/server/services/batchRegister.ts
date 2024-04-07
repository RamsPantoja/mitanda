import { type batchRegisters } from "../db/schema";
import { type TRPCContext } from "../trpc";

type BatchRegisterServiceContructor = {
    ctx: TRPCContext
}

export type BatchRegister = typeof batchRegisters.$inferSelect;

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