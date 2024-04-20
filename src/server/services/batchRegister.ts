import { type Session } from "next-auth";
import { batchRegisters } from '../db/schema';
import { type TRPCContext } from "../trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

type BatchRegisterServiceContructor = {
    ctx: TRPCContext
}

type BatchRegisterWithBatch = BatchRegister & { batch: { name: string } }
export type BatchRegister = typeof batchRegisters.$inferSelect;

class BatchRegisterService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRegisterServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }

    async searchEnableWithdrawals(session: Session): Promise<BatchRegisterWithBatch[]> {
        const enableWithdrawals = await this.ctx.db.query.batchRegisters.findMany({
            where: ((batchRegisters, { eq, and, lt, ne }) => and(eq(batchRegisters.recipientId, session.user.id), lt(batchRegisters.endDate, new Date()), ne(batchRegisters.contributionAmount, '0'))),
            with: {
                batch: {
                    columns: {
                        name: true
                    }
                }
            }
        })

        if (!enableWithdrawals) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User dont have enable withdrawals'
            })
        }

        return enableWithdrawals
    }

    async updateContributionAmount(session: Session, withdrawalId: string): Promise<BatchRegister[]> {
        const updateContributionAmount = await this.ctx.db.update(batchRegisters)
                .set({contributionAmount: '0'})
                .where(and(eq(batchRegisters.id, withdrawalId), eq(batchRegisters.recipientId, session.user.id)))
                .returning()
           //TODO unit testing
        return updateContributionAmount
    }
}

export default BatchRegisterService;