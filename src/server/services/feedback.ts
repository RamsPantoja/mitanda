import { type z } from "zod";
import { feedbacks } from "../db/schema";
import { type TRPCContext } from "../trpc";
import { type createFeedbackInputSchema } from "../schema/feedback";
import { type Session } from "next-auth";
import { TRPCError } from "@trpc/server";

type FeedbackServiceContructor = {
    ctx: TRPCContext
}


export type FeedbackInsert = typeof feedbacks.$inferInsert;
export type CreateFeedbackInput = {
    createFeedbackInputSchema: z.infer<typeof createFeedbackInputSchema>
    session: Session
}

class FeedbackService {
    ctx: TRPCContext

    constructor({ ctx }: FeedbackServiceContructor) {
        this.ctx = ctx;
    }

    async create(input: CreateFeedbackInput) {
        const [feedback] = await this.ctx.db.insert(feedbacks).values({
            content: input.createFeedbackInputSchema.content,
            userId: input.session.user.id
        }).returning();

        if (!feedback) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'Feedback was not sent',
            });
        }

        return feedback;
    }
}

export default FeedbackService;