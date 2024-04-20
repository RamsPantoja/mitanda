import { withdrawalsLog } from "../db/schema";
import { type TRPCContext } from "../trpc";
import { type createWithdrawalInput } from '../schema/withdrawal';
import {z} from 'zod'
import { TRPCError } from "@trpc/server";

type WithdrawalServiceConstructor = {
  ctx: TRPCContext
}

export type Withdrawal = typeof withdrawalsLog.$inferInsert;

type CreateWithdrawalLogInput = z.infer<typeof createWithdrawalInput>

class WithdrawalService {
  ctx: TRPCContext

  constructor({ ctx }: WithdrawalServiceConstructor) {
    this.ctx = ctx
  }

  async createWithdrawalLog( createWithdrawalInput: CreateWithdrawalLogInput ): Promise<Withdrawal> {
    const [createWithdrawal] = await this.ctx.db.insert(withdrawalsLog).values({      
      userId: createWithdrawalInput.userId,
      batchId: createWithdrawalInput.batchId,
      batchRegisterId: createWithdrawalInput.batchRegisterId,
      amount: createWithdrawalInput.amount,
    }).returning()

    if(!createWithdrawal) {
      throw new TRPCError({
        code:"CONFLICT",
        message: 'Withdrawal fail'
      })
    }      

    return createWithdrawal
  }
}

export default WithdrawalService