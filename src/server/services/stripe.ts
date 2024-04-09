import { type stripeRelationIdInputSchema } from "../schema/stripe";
import { type z } from "zod";
import { type Session } from "next-auth";
import { stripeAccounts } from '../db/schema';
import { TRPCError } from "@trpc/server";
import { Stripe } from 'stripe'
import { eq } from "drizzle-orm";
import { type TRPCContext } from "../trpc";


type AccountServiceContructor = {
    ctx: TRPCContext
}

export type StripeAccount = typeof stripeAccounts.$inferInsert

type RelationInputSchema = z.infer<typeof stripeRelationIdInputSchema>

class StripeService {
    ctx: TRPCContext
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    constructor({ ctx }: AccountServiceContructor) {
        this.ctx = ctx;
    }

    async createStripeAccount(accountId: RelationInputSchema, session: Session): Promise<StripeAccount> {
        const [stripeAccount] = await this.ctx.db.insert(stripeAccounts).values({
            accountId: accountId.accountId,
            userId: session.user.id,
        }).returning();

        if (!stripeAccount) {
            throw new TRPCError({
                code: "CONFLICT",
                message: 'StripeAccount not created'
            })
        }

        return stripeAccount;
    }

    async stripeAccountByUserId(session: Session): Promise<StripeAccount | undefined> {
        const accountFound = await this.ctx.db.query.stripeAccounts.findFirst({
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
        const accountLink = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: 'http://localhost:3000/api/stripe/connect/refresh_link',
            return_url: 'http://localhost:3000/dashboard/balance',
            type: 'account_onboarding',
        });

        if (!accountLink) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error'
            })
        }

        return accountLink
    }


    async updateOnboarding(accountId: string): Promise<object | undefined> {
        const userStripeAccount = await this.ctx.db.query.stripeAccounts.findFirst({
            where: (stripeAccounts, { eq }) => {
                return eq(stripeAccounts.accountId, accountId)
            }
        })

        if (!userStripeAccount) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Account not found'
            })
        }

        const updateOnboarState = await this.ctx.db.update(stripeAccounts)
            .set({ onboarding: true })
            .where(eq(stripeAccounts.accountId, userStripeAccount?.accountId))
            .returning()

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

    async batchPaymentLink() {
        
        return {

        }
    }
}

export default StripeService;