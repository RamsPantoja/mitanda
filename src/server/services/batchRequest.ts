import { type z } from "zod";
import { type TRPCContext } from "../trpc";
import { type whereBatchRequestInputSchema, type startBatchRequestInputSchema } from "../schema/batchRequest";
import { batchRequests, batchRequestsToUsers } from "../db/schema";
import { TRPCError } from "@trpc/server";
import type MailService from "./mail";
import initBatchEmail from "../emails/initBatch";
import { env } from "@/env";

type BatchRequestServiceContructor = {
    ctx: TRPCContext
}

type StartBatchRequestInput = z.infer<typeof startBatchRequestInputSchema>
type BatchRequestToUserInsert = typeof batchRequestsToUsers.$inferInsert
type WhereBatchRequestInput = z.infer<typeof whereBatchRequestInputSchema>

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
                html: initBatchEmail({
                    batchName: batch.name,
                    link: `${env.NEXTAUTH_URL}/dashboard/batches/batch/${batchId}`
                })
            });
        }

        return startBatchRequest;
    }
}

export default BatchRequestService;