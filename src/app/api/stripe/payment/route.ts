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
    console.log(event);

    return NextResponse.json({ code: 200, message: "Stripe payment success" });
}

export { handler as POST };