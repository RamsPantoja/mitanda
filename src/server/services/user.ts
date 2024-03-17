import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";

type UserServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

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