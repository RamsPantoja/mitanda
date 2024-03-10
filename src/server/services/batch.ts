import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type Session } from "next-auth";

type BatchServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

class BatchService {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null

    constructor({ db, session }: BatchServiceContructor) {
        this.db = db;
        this.session = session;
    }

    async create(data: number, name: string) {
        return name + `${data}`;
    }
}

export default BatchService;