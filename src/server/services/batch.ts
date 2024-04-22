import { batchContributions, batchRegisters, batches, contracts, usersToBatches, usersToContracts } from "../db/schema";
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import {
    type batchPaymentLinkInputSchema,
    type createBatchInputSchema,
    type whereInputBatchSchema
} from "../schema/batch";
import { type Session } from "next-auth";
import { and, eq, like } from "drizzle-orm";
import { type TRPCContext } from "../trpc";
import type StripeService from "./stripe";
import { type BatchContribution } from "./batchContribution";

type BatchServiceContructor = {
    ctx: TRPCContext
}

export type NewBatch = typeof batches.$inferInsert;
export type Batch = typeof batches.$inferSelect;
type CreateBatchInput = z.infer<typeof createBatchInputSchema>
type WhereInputBatch = z.infer<typeof whereInputBatchSchema>
type BatchPaymentLinkInput = z.infer<typeof batchPaymentLinkInputSchema>

type BatchContributionInput = {
    userId: string
    paymentId: string
    batchRegisterIds?: string
    batchId?: string
}

class BatchService {
    ctx: TRPCContext

    constructor({ ctx }: BatchServiceContructor) {
        this.ctx = ctx;
    }

    async create(createBatchInput: CreateBatchInput, user: Session): Promise<NewBatch> {
        const batch = await this.ctx.db.transaction(async (tx) => {
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
        return await this.ctx.db.query.batches.findMany({
            where: (batches, { eq, and, like }) => {
                return and(
                    eq(batches.userId, user.user.id),
                    like(batches.name, `%${whereInput.name}%`)
                )
            }
        })
    }

    async batches(whereInput: WhereInputBatch, user: Session) {
        const sqBatches = this.ctx.db.select().from(batches).as("batch");
        const queryResult = await this.ctx.db.select()
            .from(usersToBatches)
            .rightJoin(sqBatches, eq(usersToBatches.batchId, sqBatches.id))
            .where(and(
                eq(usersToBatches.userId, user.user.id),
                like(sqBatches.name, `%${whereInput.name}%`)
            ))

        return queryResult;
    }

    async delete(batchId: string, user: Session): Promise<Batch | undefined> {
        const deletedBatch = await this.ctx.db.transaction(async (tx) => {
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

    async batchById(batchId: string, user: Session) {
        const areYouInBatch = await this.ctx.db.query.usersToBatches.findFirst({
            where: (usersToBatches, { eq }) => {
                return and(
                    eq(usersToBatches.userId, user.user.id),
                    eq(usersToBatches.batchId, batchId),
                )
            }
        });

        if (!areYouInBatch) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'You can not see this information...',
            });
        }

        const batch = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return and(
                    eq(batches.id, batchId)
                )
            },
            with: {
                batchRegisters: {
                    with: {
                        batchContributions: true
                    }
                }
            }
        });

        if (!batch) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Batch not found',
            });
        }

        return batch;
    }

    async addUserToBatch(batchId: string, user: Session) {
        const userToBatchQuery = await this.ctx.db.query.usersToBatches.findFirst({
            where: (usersToBatches, { eq }) => {
                return and(
                    eq(usersToBatches.batchId, batchId),
                    eq(usersToBatches.userId, user.user.id),
                )
            }
        });

        if (userToBatchQuery) {
            return userToBatchQuery;
        }

        const newUserToBatch = await this.ctx.db.transaction(async (tx) => {
            const batchQuery = await tx.query.batches.findFirst({
                where: (batches, { eq }) => {
                    return and(
                        eq(batches.id, batchId),
                    )
                }
            });

            if (!batchQuery) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not found',
                });
            };

            await tx.insert(usersToContracts).values({
                contractId: batchQuery.contractId,
                userId: user.user.id
            });

            const [userToBatch] = await tx.insert(usersToBatches).values({
                batchId,
                userId: user.user.id
            }).returning();

            if (!userToBatch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Failed to add user to batch',
                });
            }

            return userToBatch;
        });

        return newUserToBatch;
    }

    public async batchPaymentLink(input: BatchPaymentLinkInput, stripeService: StripeService) {
        const { data } = input;
        const paymentLink = await stripeService.createPaymentLink(data);

        return paymentLink;
    }

    public async batchContribution(input: BatchContributionInput) {
        const {
            userId,
            paymentId,
            batchRegisterIds,
            batchId
        } = input;

        const addNumber = (numberOne: string, numberTwo: string): string => {
            const parseNumberOne: number = parseFloat(numberOne);
            const parseNumberTwo: number = parseFloat(numberTwo);
            const add: number = parseNumberOne + parseNumberTwo;

            return add.toString();
        };

        const contributions = await this.ctx.db.transaction(async (tx) => {
            if (!batchRegisterIds) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'BatchRegisterId was not provided',
                });
            }

            const batchRegisterIdsParsed = JSON.parse(batchRegisterIds) as string[];

            if (!batchId) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'BatchId was not provided',
                });
            }

            const batch = await tx.query.batches.findFirst({
                where: (batches, { eq }) => {
                    return eq(batches.id, batchId)
                }
            });

            if (!batch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not found',
                });
            }

            const createdContributions: BatchContribution[] = [];

            for (const id of batchRegisterIdsParsed) {
                const batchRegister = await tx.query.batchRegisters.findFirst({
                    where: (batchRegisters, { eq }) => {
                        return eq(batchRegisters.id, id)
                    }
                });

                if (!batchRegister) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: 'Batch Register not found',
                    });
                }

                const [batchContribution] = await tx.insert(batchContributions).values({
                    userId,
                    amount: batch.contributionAmount,
                    batchRegisterId: id,
                    paymentId,
                    batchId
                }).returning();

                if (!batchContribution) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: 'Batch Contribution was not created',
                    });
                }

                await tx.update(batchRegisters)
                    .set({
                        contributionAmount: addNumber(batchRegister.contributionAmount, batchContribution.amount),
                        updatedAt: new Date(),
                        withdraw: false
                    })
                    .where(eq(batchRegisters.id, id));

                createdContributions.push(batchContribution);
            }

            return createdContributions;
        });

        return contributions;
    }

    public async finish(batchId: string) {
        await this.ctx.db.update(batches)
            .set({
                status: "FINISHED",
                updatedAt: new Date()
            })
            .where(eq(batches.id, batchId));
    }
}

export default BatchService;