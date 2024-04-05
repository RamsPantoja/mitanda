
import { type TRPCContext } from "../trpc";

type UserToBatchServiceContructor = {
    ctx: TRPCContext
}

class UserToBatchService {
    ctx: TRPCContext

    constructor({ ctx }: UserToBatchServiceContructor) {
        this.ctx = ctx;
    }

    async getParticipantsFromBatch(batchId: string) {
        return await this.ctx.db.query.usersToBatches.findMany({
            where: (usersToBatches, { eq }) => {
                return eq(usersToBatches.batchId, batchId)
            },
            with: {
                user: true
            }
        })
    };
}

export default UserToBatchService;