import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";

type UserToBatchServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

class UserToBatchService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: UserToBatchServiceContructor) {
        this.db = db;
    }

    async getParticipantsFromBatch(batchId: string) {
        return await this.db.query.usersToBatches.findMany({
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