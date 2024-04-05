import { type TRPCContext } from "../trpc";

type AccountServiceContructor = {
    ctx: TRPCContext
}

class AccountService {
    ctx: TRPCContext

    constructor({ ctx }: AccountServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default AccountService;