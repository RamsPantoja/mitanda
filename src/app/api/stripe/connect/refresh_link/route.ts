import { createTRPCContext } from '@/server/trpc';
import { redirect } from 'next/navigation';
import { createCaller } from "@/server/root";
import { type NextRequest, NextResponse } from 'next/server';

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    })
}

const handler = async (
    request: NextRequest,
) => {
    const trpcContext = await createContext(request)
    const caller = createCaller(trpcContext)

    const accountId = await caller.stripe.stripeAccountByUserId()

    const newLink = await caller.stripe.newAccountLink(accountId!)

    if(newLink) {
        redirect(newLink.url)
    }

    return NextResponse.json(newLink)
}

export { handler as GET };