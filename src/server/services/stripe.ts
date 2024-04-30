import { type stripeItemSchema, type stripeRelationIdInputSchema } from "../schema/stripe";
import { type z } from "zod";
import { type Session } from "next-auth";
import { payments, stripeAccounts } from '../db/schema';
import { TRPCError } from "@trpc/server";
import { Stripe } from 'stripe'
import { eq } from "drizzle-orm";
import { type TRPCContext } from "../trpc";
import { type PaymentCase } from "@/lib/enum";
import type BatchService from "./batch";
import { env } from "@/env";


type AccountServiceContructor = {
    ctx: TRPCContext
}

type StripeFlowObject = {
    generateOnboardingLink: Stripe.AccountLink,
    newStripeAccount?: Stripe.Account,
    stripeAccountDB?: object
}

type PaymentLinkConfig = {
    items: StripeItem[]
    currency: string
    cancelUrl: string
    successUrl: string
    metadata: MetadataPayment
}

type ProcessPaymentInput = {
    data: {
        metadata: Stripe.Metadata | null,
        id: string,
        amount: number | null
    }
    batchService: BatchService
}

type CreatePaymentInput = {
    userId: string
    checkoutSessionId: string
    paymentCase: PaymentCase
}

export type MetadataPayment = {
    userId?: string
    batchRegisterIds?: string
    paymentCase?: PaymentCase
    batchId?: string
    batchData?: string
}

export type StripeAccount = typeof stripeAccounts.$inferInsert
export type StripeItem = z.infer<typeof stripeItemSchema>

type RelationInputSchema = z.infer<typeof stripeRelationIdInputSchema>

class StripeService {
    ctx: TRPCContext
    stripe = new Stripe(env.STRIPE_SECRET_KEY)

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

    async stripeAccountByUserId(session: Session): Promise<StripeAccount | null> {
        const accountFound = await this.ctx.db.query.stripeAccounts.findFirst({
            where: (stripeAccounts, { eq }) => {
                return eq(stripeAccounts.userId, session.user.id)
            }
        })

        if (accountFound) {// return null make the error whit query returning undefinded disappear
            return accountFound
        } else {
            return null
        }
    }

    async createStripeConnectAccount(): Promise<Stripe.Account> {
        const newAccount = await this.stripe.accounts.create({
            type: "express",
        })

        return newAccount
    }

    async newAccountLink(accountId: string): Promise<Stripe.AccountLink> {
        const accountLink = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${env.NEXTAUTH_URL}/api/stripe/connect/refresh_link`,
            return_url: `${env.NEXTAUTH_URL}/dashboard/balance`,
            type: "account_onboarding",
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

    async createStripeDshboardLink(session: Session): Promise<Stripe.LoginLink> {
        const userStripeAccount = await this.stripeAccountByUserId(session)

        if (!userStripeAccount) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
            })
        } else {
            return await this.stripe.accounts.createLoginLink(userStripeAccount.accountId)
        }
    }

    async stripeAccountFlow(session: Session): Promise<StripeFlowObject> {
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

    private computeFee(items: StripeItem[]): number {
        const percentFee = 0.04;
        const totalPrice = items.reduce<number>((acc, item) => {
            return acc + (item.unitPrice * item.quantity);
        }, 0);

        if (totalPrice && totalPrice >= 0) {
            return totalPrice * percentFee;
        } else {
            return 0;
        }
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
            metadata: config.metadata
        });

        return {
            paymentUrl: session.url
        };
    }

    private async createPayment(input: CreatePaymentInput) {
        const [payment] = await this.ctx.db.insert(payments).values({
            userId: input.userId,
            checkoutSessionId: input.checkoutSessionId,
            paymentCase: input.paymentCase,
        }).returning();

        if (!payment) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Payment was not created'
            })
        }

        return payment;
    }

    public async processPayment(paymentProcessInput: ProcessPaymentInput) {
        const { data, batchService } = paymentProcessInput;

        const {
            userId,
            paymentCase,
            batchData
        } = data.metadata as MetadataPayment;

        if (!userId) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'UserId is required'
            })
        }

        if (!paymentCase) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'PaymentCase is required'
            })
        }

        const payment = await this.createPayment({
            userId: userId,
            checkoutSessionId: data.id,
            paymentCase: paymentCase
        });

        if (paymentCase) {
            switch (paymentCase) {
                case "BATCH": {
                    await batchService.createBatchByPayment({
                        batchData,
                        paymentId: payment.id,
                        userId
                    });
                }
                    break;
                default:
                    break;
            }
        }
    }
}

export default StripeService;