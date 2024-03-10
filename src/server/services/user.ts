import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type Session } from "next-auth";

type UserServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

class UserService {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null

    constructor({ db, session }: UserServiceContructor) {
        this.db = db;
        this.session = session;
    }

    async create(data: number) {
        return data;
    }
}

export default UserService;