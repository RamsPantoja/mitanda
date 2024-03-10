import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type Session } from "next-auth";

type AccountServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

class AccountService {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null

    constructor({ db, session }: AccountServiceContructor) {
        this.db = db;
        this.session = session;
    }

    async create(data: number) {
        return data;
    }
}

export default AccountService;