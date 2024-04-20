import { type z } from "zod";
import { type TRPCContext } from "../trpc";
import { type createBatchRequestInputSchema } from "../schema/batchRequest";
import { batchRequests, batchRequestsToUsers } from "../db/schema";
import { TRPCError } from "@trpc/server";

type BatchRequestServiceContructor = {
    ctx: TRPCContext
}

type CreateBatchRequestInput = z.infer<typeof createBatchRequestInputSchema>
type BatchRequestToUserInsert = typeof batchRequestsToUsers.$inferInsert

class BatchRequestService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRequestServiceContructor) {
        this.ctx = ctx;
    }

    async create(input: CreateBatchRequestInput) {
        const {
            batchId,
            participantIds,
            type
        } = input;

        const batchRequest = await this.ctx.db.transaction(async (tx) => {
            const [createdBatchRequest] = await tx.insert(batchRequests).values({
                batchId,
                type,
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

        return batchRequest;
    }
}

export default BatchRequestService;