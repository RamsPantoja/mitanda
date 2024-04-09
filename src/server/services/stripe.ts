import { type stripeItemSchema, type stripeRelationIdInputSchema } from "../schema/stripe";
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

type PaymentLinkConfig = {
    items: StripeItem[];
    currency: string;
    cancelUrl: string;
    successUrl: string;
    metadata: string;
}


export type StripeAccount = typeof stripeAccounts.$inferInsert
export type StripeItem = z.infer<typeof stripeItemSchema>

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

    private parseStripeItems(items: StripeItem[], currency: string) {
        return items.map((item: StripeItem) => {
            return {
                price_data: {
                    currency,
                    unit_amount: parseFloat((item.unitPrice * 100).toFixed(2)),
                    product_data: {
                        name: item.concept,
                    }
                },
                quantity: item.quantity,
            }
        });
    }

    public async createPaymentLink(config: PaymentLinkConfig) {
        const customer = await this.stripe.customers.create();
        const listItems = this.parseStripeItems(config.items, config.currency);

        const session = await this.stripe.checkout.sessions.create({
            line_items: listItems,
            mode: 'payment',
            currency: "MXN",
            customer: customer.id,
            payment_method_types: ["card", "customer_balance"],
            payment_method_options: {
                customer_balance: {
                    funding_type: 'bank_transfer',
                    bank_transfer: {
                        type: 'mx_bank_transfer'
                    }
                }
            },
            success_url: config.successUrl,
            cancel_url: config.cancelUrl,
            phone_number_collection: {
                enabled: false
            },
            locale: 'es',
            metadata: JSON.parse(config.metadata) as Stripe.MetadataParam
        });

        return {
            paymentUrl: session.url
        };
    }
}

export default StripeService;