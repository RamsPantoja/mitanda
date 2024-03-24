import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { batches, contracts, usersToBatches, usersToContracts } from "../db/schema";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import { type createBatchInputSchema, type whereInputBatchSchema } from "../schema/batch";
import { type Session } from "next-auth";
import { and, eq, like } from "drizzle-orm";

type BatchServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

export type NewBatch = typeof batches.$inferInsert;
export type Batch = typeof batches.$inferSelect;

type CreateBatchInput = z.infer<typeof createBatchInputSchema>
type WhereInputBatch = z.infer<typeof whereInputBatchSchema>

class BatchService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: BatchServiceContructor) {
        this.db = db;
    }

    async create(createBatchInput: CreateBatchInput, user: Session): Promise<NewBatch> {
        const batch = await this.db.transaction(async (tx) => {
            const [contract] = await tx.insert(contracts).values({
                contributionAmount: createBatchInput.batchInput.contributionAmount.toString(),
                frequency: createBatchInput.batchInput.frequency
            }).returning()

            if (!contract) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Contract not created',
                });
            }

            const [batch] = await tx.insert(batches).values({
                name: createBatchInput.batchInput.name,
                contributionAmount: createBatchInput.batchInput.contributionAmount.toString(),
                seats: createBatchInput.batchInput.seats,
                frequency: createBatchInput.batchInput.frequency,
                userId: user.user.id,
                contractId: contract.id
            }).returning()

            if (!batch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not created',
                });
            }

            await tx.insert(usersToContracts).values({
                userId: user.user.id,
                contractId: contract.id
            });

            await tx.insert(usersToBatches).values({
                userId: user.user.id,
                batchId: batch.id
            });

            return batch;
        })

        return batch;
    }

    async ownBatches(whereInput: WhereInputBatch, user: Session): Promise<Batch[]> {
        return await this.db.query.batches.findMany({
            where: (batches, { eq, and, like }) => {
                return and(
                    eq(batches.userId, user.user.id),
                    like(batches.name, `%${whereInput.name}%`)
                )
            }
        })
    }

    async batches(whereInput: WhereInputBatch, user: Session) {
        const sqBatches = this.db.select().from(batches).as("batch");
        const queryResult = await this.db.select()
            .from(usersToBatches)
            .rightJoin(sqBatches, eq(usersToBatches.batchId, sqBatches.id))
            .where(and(
                eq(usersToBatches.userId, user.user.id),
                like(sqBatches.name, `%${whereInput.name}%`)
            ))

        return queryResult;
    }

    async delete(batchId: string, user: Session): Promise<Batch | undefined> {
        const deletedBatch = await this.db.transaction(async (tx) => {
            const batchAboutToDelete = await tx.query.batches.findFirst({
                where: (batches, { eq }) => {
                    return and(
                        eq(batches.id, batchId),
                        eq(batches.userId, user.user.id),
                    )
                }
            });

            if (!batchAboutToDelete) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not found',
                });
            }

            if (batchAboutToDelete.status !== "NOT_STARTED") {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'You can not delete this batch',
                });
            }

            await tx.delete(usersToBatches).where(eq(usersToBatches.batchId, batchId));
            await tx.delete(usersToContracts).where(eq(usersToContracts.contractId, batchAboutToDelete.contractId));
            const [batch] = await tx.delete(batches).where(eq(batches.id, batchId)).returning();
            await tx.delete(contracts).where(eq(contracts.id, batchAboutToDelete.contractId));
            return batch;
        })

        return deletedBatch;
    }
}

export default BatchService;