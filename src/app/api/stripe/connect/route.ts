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
    const event = await request.json() as Stripe.Event; 
    
    if (event.type === 'account.updated') {
        if (event.data.object.details_submitted) {
            try {
                await caller.stripe.updateOnboarding({ accountId: event.account! })
            } catch (error) {
                return NextResponse.json({
                    code: 500,
                    message: error
                })
            }
        }
    }

    return NextResponse.json({ code: 200, message: 'Onboarding finished' })
}

export { handler as POST };