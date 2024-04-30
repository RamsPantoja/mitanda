"use client"

import { type Session } from "next-auth";
import BatchInformation from "./BatchInformation";
// import ContributionHistory from "./ContributionHistory";
import ContributionRegister from "./ContributionRegister";
import useBatchContainerLogic from "./useBatchContainerLogic";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "../ui/tooltip";
import BatchRequestDialog from "./BatchRequestDialog";

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
            <TooltipProvider delayDuration={150}>
                <div className="flex flex-col gap-2 w-full">
                    <BatchRequestDialog />
                    <BatchInformation
                        batchIsError={batchIsError}
                        batchIsLoading={batchIsLoading}
                    />
                    <ContributionRegister
                        batchIsError={batchIsError}
                        batchIsLoading={batchIsLoading}
                    />
                </div>
            </TooltipProvider>
        </SessionProvider>
    )
}

export default BatchContainer;