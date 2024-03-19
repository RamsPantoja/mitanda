"use client"

import { api } from "@/trpc/react";
import BatchCard, { type BatchCardProps } from "./BatchCard";
import BatchMenubar from "./BatchMenubar";
import { mapSkeletons } from "@/lib/utils";
import BatchCardSkeleton from "./BatchCard/BatchCardSkeleton";
import { Fragment } from "react";

const batches: BatchCardProps[] = [{ batchName: "Mi primera tanda" }, { batchName: "Otra tanda" }, { batchName: "Rams tanda" }];

const BatchesContainer = ({ }) => {
    const { data, isLoading, error } = api.batch.ownUserBatches.useQuery({
        where: {
            name: 'Rams'
        }
    })

    const skeletons = mapSkeletons({
        numberOfSkeletons: 10,
        skeleton: <BatchCardSkeleton />
    })

    return (
        <div className="flex flex-col gap-6 w-full">
            <BatchMenubar />
            <div className="flex flex-row gap-4 flex-wrap overflow-auto">
                {
                    isLoading && skeletons.map((skeleton, index) => {
                        return <Fragment key={index}>
                            {skeleton}
                        </Fragment>
                    })
                }
                {
                    batches.map((batch, index) => {
                        return (
                            <BatchCard key={index} batchName={batch.batchName} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BatchesContainer;