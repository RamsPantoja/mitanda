import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type Session } from "next-auth";

type SessionServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

class SessionService {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null

    constructor({ db, session }: SessionServiceContructor) {
        this.db = db;
        this.session = session;
    }

    async create(data: number) {
        return data;
    }
}

export default SessionService;