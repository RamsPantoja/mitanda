import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";

type AccountServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

class AccountService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: AccountServiceContructor) {
        this.db = db;
    }

    async create(data: number) {
        return data;
    }
}

export default AccountService;