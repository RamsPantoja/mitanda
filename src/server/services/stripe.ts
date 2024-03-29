import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type stripeRelationIdInputSchema } from "../schema/stripe";
import { type z } from "zod";
import { type Session } from "next-auth";
import { stripeAccounts } from '../db/schema';
import { TRPCError } from "@trpc/server";


type AccountServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

export type NewAccountRelation = typeof stripeAccounts.$inferInsert

type RelationInputSchema = z.infer<typeof stripeRelationIdInputSchema>

class StripeService {
    db: NeonDatabase<DrizzleSchema>

    constructor({ db }: AccountServiceContructor) {
        this.db = db;
    }

    async create(accountId: RelationInputSchema, user: Session): Promise<NewAccountRelation> {
        const accountRelation = await this.db.transaction(async (tx) => {
            const [relation] = await tx.insert(stripeAccounts).values({
                accountId: accountId.accountId,
                userId: user.user.id
            }).returning()

            if (!relation) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: 'Relation not created'
                })
            }

            return relation
        })

        return accountRelation
    }

    async userById(session: Session): Promise<NewAccountRelation> {
        const accountFound = await this.db.query.stripeAccounts.findFirst({
            where: (stripeAccounts, { eq }) => {
                return eq(stripeAccounts.userId, session.user.id)
            }
        })

        if (!accountFound) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Account dont found'
            })
        }

        return accountFound
    }
}

export default StripeService;