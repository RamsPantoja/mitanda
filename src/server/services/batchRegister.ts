import { type Session } from "next-auth";
import { type batchRegisters } from '../db/schema';
import { type TRPCContext } from "../trpc";
import { and, eq, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

type BatchRegisterServiceContructor = {
    ctx: TRPCContext
}

export type BatchRegister = typeof batchRegisters.$inferSelect;

class BatchRegisterService {
    ctx: TRPCContext

    constructor({ ctx }: BatchRegisterServiceContructor) {
        this.ctx = ctx;
    }

    async create(data: number) {
        return data;
    }

    async searchEnableWithdrawals(session: Session): Promise<unknown> {
        console.log(new Date())

        const enableWithdrawals = await this.ctx.db.query.batchRegisters.findMany({
            where: ((batchRegisters, {eq, and, lt}) => and(eq(batchRegisters.recipientId, session.user.id),lt(batchRegisters.endDate,new Date())))            
        })

        if(!enableWithdrawals){
            throw new TRPCError({
                code:'NOT_FOUND',
                message: 'User dont have enable withdrawals'
            })
        }

        return enableWithdrawals
    }
}

export default BatchRegisterService;