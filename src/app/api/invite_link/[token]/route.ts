import { env } from "@/env";
import { type JwtPayload, verify } from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation'

const handler = async (
  request: NextRequest,
  { params }: { params: { token: string } }
) => {
  let dataToken: JwtPayload

  try {
    dataToken = verify(params.token, env.INVITE_LINK_SECRET) as JwtPayload;
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Failed to validate link or link has expired"
    })
  }

  if (dataToken) {
    redirect(`/invite_link/batch/${dataToken.batchId}`);
  } else {
    return NextResponse.json({
      status: 500,
      error: "Failed to validate link or link has expired"
    })
  }
}

export { handler as GET };