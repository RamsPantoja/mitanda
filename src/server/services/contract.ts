import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";

type ContractServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

class ContractService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: ContractServiceContructor) {
        this.db = db;
    }

    async create(data: number) {
        return data;
    }
}

export default ContractService;