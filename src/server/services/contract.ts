import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type Session } from "next-auth";

type ContractServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null
}

class ContractService {
    db: NeonDatabase<DrizzleSchema>
    session: Session | null

    constructor({ db, session }: ContractServiceContructor) {
        this.db = db;
        this.session = session;
    }

    async create(data: number) {
        return data;
    }
}

export default ContractService;