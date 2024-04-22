import { type z } from "zod";
import { type TRPCContext } from "../trpc";
import { type whereBatchRequestInputSchema, type startBatchRequestInputSchema, type checkStartBatchRequestInputSchema } from "../schema/batchRequest";
import { batchRegisters, batchRequests, batchRequestsToUsers, batches } from "../db/schema";
import { TRPCError } from "@trpc/server";
import type MailService from "./mail";
import startBatchRequestEmail from "../emails/startBatchRequest";
import { env } from "@/env";
import { and, eq } from "drizzle-orm";
import { type Session } from "next-auth";
import { type Batch } from "./batch";
import { DateTime, type DurationLike } from "luxon";
import type NotificationService from "./notification";
import { type NotificationInsert } from "./notification";
import startedBatchEmail from "../emails/started_batch";

type BatchRequestServiceContructor = {
    ctx: TRPCContext
}

type StartBatchRequestInput = z.infer<typeof startBatchRequestInputSchema>
type BatchRequestToUserInsert = typeof batchRequestsToUsers.$inferInsert
type WhereBatchRequestInput = z.infer<typeof whereBatchRequestInputSchema>
type CheckStartBatchRequestInputSchema = z.infer<typeof checkStartBatchRequestInputSchema>
type BatchRegisterInsert = typeof batchRegisters.$inferInsert;
type CheckStartBatchRequestInput = {
    checkStartBatchRequestInputSchema: CheckStartBatchRequestInputSchema
    session: Session
    notificationService: NotificationService
    mailService: MailService
}

class BatchRequestService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRequestServiceContructor) {
        this.ctx = ctx;
    }

    public async getBatchRequest(whereInput: WhereBatchRequestInput) {
        const {
            type,
            status,
            batchId
        } = whereInput;

        const batchRequest = await this.ctx.db.query.batchRequests.findFirst({
            where: (batchRequests, { eq, and }) => {
                return and(
                    eq(batchRequests.batchId, batchId),
                    status ? eq(batchRequests.status, status) : undefined,
                    type ? eq(batchRequests.type, type) : undefined
                );
            },
            with: {
                batchRequestsToUsers: true
            }
        });

        return batchRequest;
    }

    public async start(input: StartBatchRequestInput, mailService: MailService) {
        const {
            batchId,
            participantIds,
        } = input;

        const batchRequest = await this.ctx.db.query.batchRequests.findFirst({
            where: (batchRequests, { eq, and }) => {
                return and(
                    eq(batchRequests.status, "SENT"),
                    eq(batchRequests.type, "START")
                );
            },
        });

        if (batchRequest) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Already exist a batch request to init the batch',
            });
        }

        const startBatchRequest = await this.ctx.db.transaction(async (tx) => {
            const [createdBatchRequest] = await tx.insert(batchRequests).values({
                batchId,
                type: "START",
                status: "SENT"
            }).returning();

            if (!createdBatchRequest) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Batch Request not created',
                });
            }

            const requestedUsers: BatchRequestToUserInsert[] = participantIds.map((item) => {
                return {
                    userId: item,
                    batchRequestId: createdBatchRequest.id,
                    check: item === this.ctx.session?.user.id
                }
            });

            await tx.insert(batchRequestsToUsers).values(requestedUsers);

            return createdBatchRequest;
        });

        const usersList = await this.ctx.db.query.users.findMany({
            where: (users, { inArray }) => {
                return inArray(users.id, participantIds);
            },
            columns: {
                email: true
            }
        });

        const batch = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return eq(batches.id, batchId);
            },
        });

        if (usersList && batch) {
            await mailService.send({
                to: usersList.map((item) => item.email),
                from: 'Mitanda <no-reply@mitanda.xyz>',
                subject: "Solicitud para iniciar tanda",
                html: startBatchRequestEmail({
                    batchName: batch.name,
                    link: `${env.NEXTAUTH_URL}/dashboard/batches/batch/${batchId}`
                })
            });
        }

        return startBatchRequest;
    }

    private buildBatchRegisters(batch: Batch, participantIds: string[]) {
        const registers: BatchRegisterInsert[] = [];

        const shuffle = (array: string[]) => {
            return array.sort(() => Math.random() - 0.5);
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

    public async checkStartBatchRequest(input: CheckStartBatchRequestInput) {
        const {
            checkStartBatchRequestInputSchema,
            session,
            notificationService,
            mailService
        } = input;

        const batch = await this.ctx.db.query.batches.findFirst({
            where: (batches, { eq }) => {
                return and(
                    eq(batches.id, checkStartBatchRequestInputSchema.batchId),
                )
            }
        });

        const result = await this.ctx.db.transaction(async (tx) => {
            //Updating the check param with the current user that accepts the batch request
            await tx.update(batchRequestsToUsers)
                .set({
                    check: true
                })
                .where(
                    and(
                        eq(batchRequestsToUsers.batchRequestId, checkStartBatchRequestInputSchema.batchRequestId),
                        eq(batchRequestsToUsers.userId, session.user.id)
                    )
                );

            //Getting all batchRequestToUsers records with the batchRequestId param
            const batchRequestsToUsersList = await tx.query.batchRequestsToUsers.findMany({
                where: (batchRequestsToUsers, { eq }) => {
                    return eq(batchRequestsToUsers.batchRequestId, checkStartBatchRequestInputSchema.batchRequestId)
                }
            });

            if (batchRequestsToUsersList.length === 0) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Not requested users by Batch Request',
                });
            };

            //If all users have accepted the batch request then starting the batch
            if (batchRequestsToUsersList.every((item) => item.check)) {
                const [batchRequest] = await tx.update(batchRequests)
                    .set({
                        status: "ACCEPTED"
                    })
                    .where(eq(batchRequests.id, checkStartBatchRequestInputSchema.batchRequestId))
                    .returning();

                if (!batchRequest) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: 'Batch Request was not updated to "Accepted" status',
                    });
                }

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
                const batchRegistersToInsert = this.buildBatchRegisters(batch, checkStartBatchRequestInputSchema.participantIds);

                await tx.insert(batchRegisters).values(batchRegistersToInsert);

                //Updating the batch to InProgress status, then the batch has been started
                const [updatedBatch] = await tx.update(batches)
                    .set({
                        status: "IN_PROGRESS",
                        updatedAt: new Date()
                    })
                    .where(eq(batches.id, checkStartBatchRequestInputSchema.batchId))
                    .returning();

                if (!updatedBatch) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: 'The batch may not have started correctly',
                    });
                }

                return batchRequest;
            }
        });

        //If result is different of undefined means that the batch has been started and send notifications
        if (result && batch) {
            const notifications: NotificationInsert[] = checkStartBatchRequestInputSchema.participantIds.map((item) => {
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
                    return inArray(users.id, checkStartBatchRequestInputSchema.participantIds)
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
            })
        }

        return result;
    }
}

export default BatchRequestService;