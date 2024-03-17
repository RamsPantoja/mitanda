import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";

type SessionServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

class SessionService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: SessionServiceContructor) {
        this.db = db;
    }

    async create(data: number) {
        return data;
    }
}

export default SessionService;