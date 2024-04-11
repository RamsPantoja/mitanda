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
    const trpcContext = await createContext(request)
    const caller = createCaller(trpcContext)
    const responseText = await new NextResponse(request.body).text()
    const response = JSON.parse(responseText) as Stripe.Event

    if (response.type === 'account.updated') {
        if (response.data.object.details_submitted) {
            try {
                await caller.stripe.updateOnboarding({ accountId: response.account! })
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