import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type users } from "../db/schema";

type UserServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

export type User = typeof users.$inferSelect;

class UserService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: UserServiceContructor) {
        this.db = db;
    }

    async create(data: number) {
        return data;
    }
}

export default UserService;