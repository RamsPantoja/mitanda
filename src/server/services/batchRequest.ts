import { type z } from "zod";
import { type TRPCContext } from "../trpc";
import { type startBatchRequestInputSchema } from "../schema/batchRequest";
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

class BatchRequestService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRequestServiceContructor) {
        this.ctx = ctx;
    }

    async start(input: StartBatchRequestInput, mailService: MailService) {
        const {
            batchId,
            participantIds,
        } = input;

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