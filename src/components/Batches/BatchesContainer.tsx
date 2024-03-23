"use client"

import BatchCard from "./BatchCard";
import BatchMenubar from "./BatchMenubar";
import { Fragment } from "react";
import useBatchesLogic from "./useBatchesLogic";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type BatchesContainerProps = {
    session: Session
}

const BatchesContainer = ({ session }: BatchesContainerProps) => {
    const {
        ownBatchesData,
        ownBatchesIsLoading,
        skeletons,
        onSearchBatch,
        displayOnlyOwnBatches,
        onOwnBatches,
        batchesData,
        batchesIsLoading
    } = useBatchesLogic();

    return (
        <SessionProvider session={session}>
            <div className="flex flex-col gap-6 w-full">
                <BatchMenubar
                    onSearch={onSearchBatch}
                    displayOnlyOwnBatches={displayOnlyOwnBatches}
                    onOwnBatches={onOwnBatches}
                />
                <div className="flex flex-row gap-4 flex-wrap overflow-auto">
                    {
                        (ownBatchesIsLoading || batchesIsLoading) && skeletons.map((skeleton, index) => {
                            return <Fragment key={index}>
                                {skeleton}
                            </Fragment>
                        })
                    }
                    {
                        displayOnlyOwnBatches && ownBatchesData && ownBatchesData.length > 0 && ownBatchesData.map((batch) => {
                            return (
                                <BatchCard
                                    key={batch.id}
                                    batchName={batch.name}
                                    seats={batch.seats}
                                    contributionAmount={batch.contributionAmount}
                                    ownerId={batch.userId}
                                    status={batch.status}
                                />
                            )
                        })
                    }
                    {
                        !displayOnlyOwnBatches && batchesData && batchesData.length > 0 && batchesData.map((batch) => {
                            return (
                                <BatchCard
                                    key={batch.batch.id}
                                    batchName={batch.batch.name}
                                    seats={batch.batch.seats}
                                    contributionAmount={batch.batch.contributionAmount}
                                    ownerId={batch.batch.userId}
                                    status={batch.batch.status}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </SessionProvider>
    )
}

export default BatchesContainer;