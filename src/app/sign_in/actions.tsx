"use server"

import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
    const session = await getServerSession(authOptions);

    if (session !== null) {
        redirect(`/dashboard`)
    }
}