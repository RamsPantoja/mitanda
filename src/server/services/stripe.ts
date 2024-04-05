import { type NeonDatabase } from "drizzle-orm/neon-serverless";
import { type DrizzleSchema } from "../db";
import { type stripeRelationIdInputSchema } from "../schema/stripe";
import { type z } from "zod";
import { type Session } from "next-auth";
import { stripeAccounts } from '../db/schema';
import { TRPCError } from "@trpc/server";
import { Stripe } from 'stripe'
import { eq } from "drizzle-orm";


type AccountServiceContructor = {
    db: NeonDatabase<DrizzleSchema>
}

export type StripeAccount = typeof stripeAccounts.$inferInsert

type RelationInputSchema = z.infer<typeof stripeRelationIdInputSchema>

class StripeService {
    db: NeonDatabase<DrizzleSchema>
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    constructor({ db }: AccountServiceContructor) {
        this.db = db;
    }

    async createStripeAccount(accountId: RelationInputSchema, session: Session): Promise<StripeAccount> {
        const accountRelation = await this.db.transaction(async (tx) => {
            const [relation] = await tx.insert(stripeAccounts).values({
                accountId: accountId.accountId,
                userId: session.user.id,
            }).returning()//TODO revisar las transaccion inecesarias

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

    async stripeAccountByUserId(session: Session): Promise<StripeAccount | undefined> {
        const accountFound = await this.db.query.stripeAccounts.findFirst({
            where: (stripeAccounts, { eq }) => {
                return eq(stripeAccounts.userId, session.user.id)
            }
        })

        return accountFound
    }

    async createStripeConnectAccount(): Promise<Stripe.Account> {
        try {
            const newAccount = await this.stripe.accounts.create({
                type: 'express'
            })

            return newAccount

        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error'
            })
        }
    }

    async newAccountLink(accountId: string): Promise<Stripe.AccountLink> {
        try {
            const accountLink = await this.stripe.accountLinks.create({
                account: accountId,
                refresh_url: 'http://localhost:3000/api/stripe/connect/refresh_link',
                return_url: 'http://localhost:3000/dashboard/balance',
                type: 'account_onboarding',
            });

            return accountLink
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error'
            })
        }
    }

    async updateOnboarding(accountId: string): Promise<object | undefined> {
        const userStripeAccount = await this.db.query.stripeAccounts.findFirst({
            where: (stripeAccounts, { eq }) => {
                return eq(stripeAccounts.accountId, accountId)
            }
        })

        console.log(accountId)

        if(!userStripeAccount){
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Account not found'
            })
        }
       
        const updateOnboarState = await this.db.update(stripeAccounts)
            .set({ onboarding: true })
            .where(eq(stripeAccounts.accountId, userStripeAccount?.accountId))
            .returning()
       
            // const updateOnboarState: { oboarding: boolean }[] = await this.db.update(stripeAccounts)
            //     .set({ onboarding: true })
            //     .where(eq(stripeAccounts.userId, userStripeAccount!.userId))
            //     .returning({ oboarding: stripeAccounts.onboarding });
            return updateOnboarState
    }

    async stripeAccountFlow(session: Session): Promise<object> {
        let generateOnboardingLink: Stripe.AccountLink
        let newStripeAccount: Stripe.Account
        let stripeAccountDB: StripeAccount

        const stripeAccount = await this.stripeAccountByUserId(session)

        if (!stripeAccount) {
            newStripeAccount = await this.createStripeConnectAccount()
            stripeAccountDB = await this.createStripeAccount({ accountId: newStripeAccount.id }, session)
            generateOnboardingLink = await this.newAccountLink(newStripeAccount.id)

            return { generateOnboardingLink, newStripeAccount, stripeAccountDB }
        } else {
            generateOnboardingLink = await this.newAccountLink(stripeAccount.accountId)

            return { generateOnboardingLink }
        }
    }
}

export default StripeService;