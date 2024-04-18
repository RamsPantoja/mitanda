import { type Session } from "next-auth";
import { type batchRegisters } from '../db/schema';
import { type TRPCContext } from "../trpc";
import { TRPCError } from "@trpc/server";

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
}

export default BatchRegisterService;