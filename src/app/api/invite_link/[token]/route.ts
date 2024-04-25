import { env } from "@/env";
import { type JwtPayload, verify } from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { createTRPCContext } from "@/server/trpc";
import { createCaller } from "@/server/root";
import { usersToBatches } from '../../../../server/db/schema';

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const getUserSession = async (token: string) => {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect(`/sign_in?callback_url=/api/invite_link/${token}`)
  }

  return session;
};

const handler = async (
  request: NextRequest,
  { params }: { params: { token: string } }
) => {
  let dataToken: JwtPayload
  const trpcContext = await createContext(request);
  const caller = createCaller(trpcContext);

  try {
    dataToken = verify(params.token, env.INVITE_LINK_SECRET) as JwtPayload;
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Failed to validate link or link has expired"
    })
  }

  if (dataToken?.batchId) {
    await getUserSession(params.token);

    const batchJoinInfo = await caller.batch.batchJoinInfo({
      batchId: dataToken.batchId as string
    })

    const batchStatus = batchJoinInfo?.status

    console.log(batchJoinInfo?.status, batchJoinInfo?.usersToBatches.length)

    batchJoinInfo ? batchStatus === "IN_PROGRESS" || batchStatus === 'FINISHED' || batchStatus === 'PAUSED' ? redirect('/joinToBatchError/BATCH_ONPROGRESS')
      : batchJoinInfo.usersToBatches.length === batchJoinInfo.seats ? redirect('/joinToBatchError/MAX_USERS') : null
      : null

    const addUserToBatch = await caller.batch.addUserToBatch({
      batchId: dataToken.batchId as string
    });


    if (addUserToBatch) {
      redirect(`/dashboard/batches/batch/${addUserToBatch.batchId}`);
    } else {
      return NextResponse.json({
        status: 500,
        error: "Error on add user method"
      });
    }

  } else {
    return NextResponse.json({
      status: 500,
      error: "Failed to validate link or link has expired"
    })
  }
}

export { handler as GET };