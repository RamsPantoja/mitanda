"use client"

import { type Session } from "next-auth";
import BatchInformation from "./BatchInformation";
import ContributionHistory from "./ContributionHistory";
import ContributionRegister from "./ContributionRegister";
import useBatchContainerLogic from "./useBatchContainerLogic";
import { SessionProvider } from "next-auth/react";

type BatchContainerProps = {
    session: Session
}

const BatchContainer = ({ session }: BatchContainerProps) => {
    const {
        batchIsLoading,
        batchIsError
    } = useBatchContainerLogic();

    return (
        <SessionProvider session={session}>
            <div className="flex flex-col gap-2 w-full">
                <BatchInformation
                    batchIsError={batchIsError}
                    batchIsLoading={batchIsLoading}
                />
                <ContributionRegister
                    batchIsError={batchIsError}
                    batchIsLoading={batchIsLoading}
                />
                <ContributionHistory />
            </div>
        </SessionProvider>
    )
}

export default BatchContainer;