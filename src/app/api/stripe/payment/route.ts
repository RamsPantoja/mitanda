import { type NextRequest, NextResponse } from 'next/server';
import { type Stripe } from 'stripe';
import { createCaller } from '@/server/root';
import { createTRPCContext } from '@/server/trpc';

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers
    })
}

const handler = async (
    request: NextRequest,
) => {
    const trpcContext = await createContext(request);
    const caller = createCaller(trpcContext);
    const event = await request.json() as Stripe.Event

    switch (event.type) {
        case "checkout.session.completed": {
            //Card payment
            if (event.data.object.payment_status === "paid") {
                await caller.stripe.paymentProcess({
                    metadata: event.data.object.metadata,
                    id: event.data.object.id,
                    amount: event.data.object.amount_subtotal
                });
            }
        }
            break;
        case "checkout.session.async_payment_succeeded": {
            //Transaction payment
            await caller.stripe.paymentProcess({
                metadata: event.data.object.metadata,
                id: event.data.object.id,
                amount: event.data.object.amount_subtotal
            });
        }
            break;
        default:
            break;
    }

    return NextResponse.json({ code: 200, message: "Stripe payment success" });
}

export { handler as POST };