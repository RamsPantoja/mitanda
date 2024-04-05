import { type TRPCContext } from "../trpc";

type SessionServiceContructor = {
    ctx: TRPCContext
}

class SessionService {
    ctx: TRPCContext

    constructor({ ctx }: SessionServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default SessionService;