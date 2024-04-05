import { type TRPCContext } from "../trpc";


type ContractServiceContructor = {
    ctx: TRPCContext
}

class ContractService {
    ctx: TRPCContext

    constructor({ ctx }: ContractServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }
}

export default ContractService;