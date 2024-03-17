import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { db, type DrizzleSchema } from "../db";
import { batches, contracts, usersToContracts } from "../db/schema";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import { type createBatchInputSchema } from "../schema/batch";
import { type Session } from "next-auth";

type BatchServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

export type NewBatch = typeof batches.$inferInsert;

type CreateBatchInput = z.infer<typeof createBatchInputSchema>

class BatchService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: BatchServiceContructor) {
        this.db = db;
    }

    async create(createBatchInput: CreateBatchInput, user: Session): Promise<NewBatch> {
        const [contract] = await db.insert(contracts).values({
            contributionAmount: createBatchInput.batchInput.contributionAmount.toString(),
            frequency: createBatchInput.batchInput.frequency
        }).returning()

        if (!contract) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Contract not created',
            });
        }

        const [batche] = await this.db.insert(batches).values({
            name: createBatchInput.batchInput.name,
            contributionAmount: createBatchInput.batchInput.contributionAmount.toString(),
            seats: createBatchInput.batchInput.seats,
            frequency: createBatchInput.batchInput.frequency,
            userId: user.user.id,
            contractId: contract.id
        }).returning()

        await this.db.insert(usersToContracts).values({
            userId: user.user.id,
            contractId: contract.id
        })

        if (!batche) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Batche not created',
            });
        }

        return batche
    }
}

export default BatchService;