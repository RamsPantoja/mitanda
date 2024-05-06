import { batchContributions, batchRegisters, batches, chats, contracts, paymentsToBatches, usersToBatches, usersToContracts } from '../db/schema';
import { TRPCError } from "@trpc/server";
import { type z } from "zod";
import {
    type startBatchInputSchema,
    type addBatchContributionInputSchema,
    type batchPaymentLinkInputSchema,
    type createBatchInputSchema,
    type whereInputBatchSchema
} from "../schema/batch";
import { type Session } from "next-auth";
import { and, eq, like } from "drizzle-orm";
import { type TRPCContext } from "../trpc";
import type StripeService from "./stripe";
import type NotificationService from './notification';
import type MailService from './mail';
import { DateTime, type DurationLike } from 'luxon';
import { type NotificationInsert } from './notification';
import startedBatchEmail from '../emails/started_batch';
import { env } from '@/env';
// import { type BatchContribution } from "./batchContribution";

type BatchServiceContructor = {
    ctx: TRPCContext
}

export type NewBatch = typeof batches.$inferInsert;
export type Batch = typeof batches.$inferSelect;
type CreateBatchInput = z.infer<typeof createBatchInputSchema>
type WhereInputBatch = z.infer<typeof whereInputBatchSchema>
type BatchPaymentLinkInput = z.infer<typeof batchPaymentLinkInputSchema>
type AddBatchContributionInput = z.infer<typeof addBatchContributionInputSchema>
type JoinToBatchInfo = Batch & { usersToBatches: { userId: string, batchId: string }[] }
type StartBatchInputSchema = z.infer<typeof startBatchInputSchema>
type BatchRegisterInsert = typeof batchRegisters.$inferInsert;

type StartBatchRequestInput = {
    startBatchInputSchema: StartBatchInputSchema
    notificationService: NotificationService
    mailService: MailService
}

// type BatchContributionInput = {
//     userId: string
//     batchRegisterIds?: string
//     batchId?: string
// }

type CreateBatchByPaymentInput = {
    userId?: string
    batchData?: string
    paymentId: string
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

            await tx.insert(chats).values({
                batchId: batch.id,
            }).returning();

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

        const paymentLink = await stripeService.createPaymentLink({
            items: data.items,
            cancelUrl: data.cancelUrl,
            successUrl: data.successUrl,
            currency: data.currency,
            metadata: data.metadata
        });

        return paymentLink;
    }

    public async addBatchContribution(input: AddBatchContributionInput) {
        const {
            userId,
            batchId,
            batchRegisterId
        } = input;

        const addNumber = (numberOne: string, numberTwo: string): string => {
            const parseNumberOne: number = parseFloat(numberOne);
            const parseNumberTwo: number = parseFloat(numberTwo);
            const add: number = parseNumberOne + parseNumberTwo;

            return add.toString();
        };

        const contribution = await this.ctx.db.transaction(async (tx) => {
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

            const batchRegister = await tx.query.batchRegisters.findFirst({
                where: (batchRegisters, { eq }) => {
                    return eq(batchRegisters.id, batchRegisterId)
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
                batchRegisterId,
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
                .where(eq(batchRegisters.id, batchRegisterId));

            return batchContribution;
        });

        return contribution;
    }

    // public async batchContribution(input: BatchContributionInput) {
    //     const {
    //         userId,
    //         paymentId,
    //         batchRegisterIds,
    //         batchId
    //     } = input;

    //     const addNumber = (numberOne: string, numberTwo: string): string => {
    //         const parseNumberOne: number = parseFloat(numberOne);
    //         const parseNumberTwo: number = parseFloat(numberTwo);
    //         const add: number = parseNumberOne + parseNumberTwo;

    //         return add.toString();
    //     };

    //     const contributions = await this.ctx.db.transaction(async (tx) => {
    //         if (!batchRegisterIds) {
    //             throw new TRPCError({
    //                 code: "CONFLICT",
    //                 message: 'BatchRegisterId was not provided',
    //             });
    //         }

    //         const batchRegisterIdsParsed = JSON.parse(batchRegisterIds) as string[];

    //         if (!batchId) {
    //             throw new TRPCError({
    //                 code: "CONFLICT",
    //                 message: 'BatchId was not provided',
    //             });
    //         }

    //         const batch = await tx.query.batches.findFirst({
    //             where: (batches, { eq }) => {
    //                 return eq(batches.id, batchId)
    //             }
    //         });

    //         if (!batch) {
    //             throw new TRPCError({
    //                 code: "CONFLICT",
    //                 message: 'Batch not found',
    //             });
    //         }

    //         const createdContributions: BatchContribution[] = [];

    //         for (const id of batchRegisterIdsParsed) {
    //             const batchRegister = await tx.query.batchRegisters.findFirst({
    //                 where: (batchRegisters, { eq }) => {
    //                     return eq(batchRegisters.id, id)
    //                 }
    //             });

    //             if (!batchRegister) {
    //                 throw new TRPCError({
    //                     code: "CONFLICT",
    //                     message: 'Batch Register not found',
    //                 });
    //             }

    //             const [batchContribution] = await tx.insert(batchContributions).values({
    //                 userId,
    //                 amount: batch.contributionAmount,
    //                 batchRegisterId: id,
    //                 paymentId,
    //                 batchId
    //             }).returning();

    //             if (!batchContribution) {
    //                 throw new TRPCError({
    //                     code: "CONFLICT",
    //                     message: 'Batch Contribution was not created',
    //                 });
    //             }

    //             await tx.update(batchRegisters)
    //                 .set({
    //                     contributionAmount: addNumber(batchRegister.contributionAmount, batchContribution.amount),
    //                     updatedAt: new Date(),
    //                     withdraw: false
    //                 })
    //                 .where(eq(batchRegisters.id, id));

    //             createdContributions.push(batchContribution);
    //         }

    //         return createdContributions;
    //     });

    //     return contributions;
    // }

    public async finish(batchId: string) {
        await this.ctx.db.update(batches)
            .set({
                status: "FINISHED",
                updatedAt: new Date()
            })
            .where(eq(batches.id, batchId));
    }

    //get info to see if user can join to the batch
    public async joinToBatchInfo(batchId: string): Promise<JoinToBatchInfo | null> {
        const batchInfoToJoin = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return eq(batches.id, batchId)
            },
            with: {
                usersToBatches: {
                    where: (usersToBatches, { eq }) => {
                        return eq(usersToBatches.batchId, batchId)
                    }
                }
            }
        })

        if (!batchInfoToJoin) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Batch not found'
            })
        }

        return batchInfoToJoin
    }

    private buildBatchRegisters(batch: Batch, participantIds: string[]) {
        const registers: BatchRegisterInsert[] = [];

        const shuffle = (array: string[]): string[] => {
            // Create a copy of the array to avoid modifying the original
            const shuffledArray = [...array];

            let currentIndex = shuffledArray.length;
            let randomIndex;

            // While there are elements remaining to shuffle
            while (currentIndex !== 0) {
                // Pick a remaining element
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                // Swap the current element with the random element
                [shuffledArray[currentIndex] as unknown, shuffledArray[randomIndex] as unknown] = [
                    shuffledArray[randomIndex],
                    shuffledArray[currentIndex],
                ];
            }

            return shuffledArray;
        };

        const participantIdsSuffle = shuffle(participantIds);

        const getTimeFactor = (): DurationLike => {
            switch (batch.frequency) {
                case "WEEKLY":
                    return {
                        week: 1
                    }
                case "BIWEEKLY":
                    return {
                        weeks: 2
                    }
                case "MONTHLY":
                    return {
                        month: 1
                    }
                default:
                    return {};
            }
        }

        for (let i = 0; i < participantIdsSuffle.length; i++) {
            const accumulator: BatchRegisterInsert[] = [...registers];
            const previousElement = accumulator[i - 1];
            const participantId = participantIdsSuffle[i];

            if (!participantId) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'ParticipantID not provided',
                });
            }

            if (previousElement) {
                registers.push({
                    batchId: batch.id,
                    frequency: batch.frequency,
                    startDate: previousElement.endDate,
                    endDate: DateTime.fromJSDate(previousElement.endDate).plus(getTimeFactor()).toJSDate(),
                    batchNumber: i + 1,
                    recipientId: participantId
                });
            } else {
                registers.push({
                    batchId: batch.id,
                    frequency: batch.frequency,
                    startDate: DateTime.now().toJSDate(),
                    endDate: DateTime.now().plus(getTimeFactor()).toJSDate(),
                    batchNumber: i + 1,
                    recipientId: participantId
                });
            }
        }

        return registers;
    }

    public async startBatch(input: StartBatchRequestInput) {
        const {
            startBatchInputSchema,
            notificationService,
            mailService
        } = input;

        const batch = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return and(
                    eq(batches.id, startBatchInputSchema.batchId),
                )
            }
        });

        const result = await this.ctx.db.transaction(async (tx) => {
            if (!batch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not found',
                });
            };

            if (batch.status === 'IN_PROGRESS') {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'The batch already has been initialized',
                });
            }

            //Method to build the Batch registers that will be inserted 
            const batchRegistersToInsert = this.buildBatchRegisters(batch, startBatchInputSchema.participantIds);

            await tx.insert(batchRegisters).values(batchRegistersToInsert);

            //Updating the batch to InProgress status, then the batch has been started
            const [updatedBatch] = await tx.update(batches)
                .set({
                    status: "IN_PROGRESS",
                    updatedAt: new Date()
                })
                .where(eq(batches.id, startBatchInputSchema.batchId))
                .returning();

            if (!updatedBatch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'The batch may not have started correctly',
                });
            }

            return updatedBatch;
        });

        //If result is different of undefined means that the batch has been started and send notifications
        if (result && batch) {
            const notifications: NotificationInsert[] = startBatchInputSchema.participantIds.map((item) => {
                return {
                    link: `/dashboard/batches/batch/${batch.id}`,
                    iconUrl: "",
                    receiverId: item,
                    content: `<p>La tanda <strong>${batch.name}</strong> ha sido iniciada!</p>`
                }
            });

            await notificationService.create(notifications);

            const usersList = await this.ctx.db.query.users.findMany({
                where: (users, { inArray }) => {
                    return inArray(users.id, startBatchInputSchema.participantIds)
                }
            });

            await mailService.send({
                to: usersList.map((item) => item.email),
                from: 'Mitanda <no-reply@mitanda.xyz>',
                subject: "Tanda iniciada",
                html: startedBatchEmail({
                    batchName: batch.name,
                    link: `${env.NEXTAUTH_URL}/dashboard/batches/batch/${batch.id}`
                })
            });
        }

        return result;
    }

    public async firstBatchByUserId(userId: string) {
        const userHasBatch = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return eq(batches.userId, userId)
            }
        });

        if (userHasBatch) {
            return true;
        } else {
            return false;
        }
    }

    public async createBatchByPayment(input: CreateBatchByPaymentInput) {
        const {
            paymentId,
            batchData,
            userId
        } = input;


        if (!batchData) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Batch data not provided',
            });
        }

        if (!userId) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'User id not provided',
            });
        }

        const batchDataParse = JSON.parse(batchData) as NewBatch;

        const batch = await this.ctx.db.transaction(async (tx) => {
            const [contract] = await tx.insert(contracts).values({
                contributionAmount: batchDataParse.contributionAmount.toString(),
                frequency: batchDataParse.frequency
            }).returning()

            if (!contract) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Contract not created',
                });
            }

            const [batch] = await tx.insert(batches).values({
                name: batchDataParse.name,
                contributionAmount: batchDataParse.contributionAmount.toString(),
                seats: batchDataParse.seats,
                frequency: batchDataParse.frequency,
                userId,
                contractId: contract.id
            }).returning()

            if (!batch) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch not created',
                });
            }

            await tx.insert(usersToContracts).values({
                userId,
                contractId: contract.id
            });

            await tx.insert(usersToBatches).values({
                userId,
                batchId: batch.id
            });

            await tx.insert(paymentsToBatches).values({
                paymentId,
                batchId: batch.id
            });

            await tx.insert(chats).values({
                batchId: batch.id,
            });

            return batch;
        })

        return batch;
    }

    public async deteleUserFromBatch(userId: string, batchId: string, contractId: string): Promise<unknown> {
        const deleteUser = await this.ctx.db.transaction(async (tx) => {
            const userToDeleteFromBatch = await tx.query.usersToBatches.findFirst({
                where: (usersToBatches, { eq }) => {
                    return and(
                        eq(usersToBatches.userId, userId),
                        eq(usersToBatches.batchId, batchId),
                    )
                }
            });

            if (!userToDeleteFromBatch) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found in batch'
                })
            }

            const userToDeleteFromContracts = await tx.query.usersToContracts.findFirst({
                where: (usersToContracts, { eq }) => {
                    return and(
                        eq(usersToContracts.userId, userId),
                        eq(usersToContracts.contractId, contractId),
                    )
                }
            });

            if (!userToDeleteFromContracts) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Contract of user not found'
                })
            }

            await tx.delete(usersToBatches).where(and(
                eq(usersToBatches.userId, userId),
                eq(usersToBatches.batchId, batchId),
            ))

            await tx.delete(usersToContracts).where(and(
                eq(usersToContracts.userId, userId),
                eq(usersToContracts.contractId, contractId),
            ))

            return {userToDeleteFromBatch, userToDeleteFromContracts}
        })

        return deleteUser
    }
}

export default BatchService;