"use client"

import { api } from "@/trpc/react";
import BatchCard from "./BatchCard";
import BatchMenubar from "./BatchMenubar";
import { mapSkeletons } from "@/lib/utils";
import BatchCardSkeleton from "./BatchCard/BatchCardSkeleton";
import { Fragment } from "react";

const BatchesContainer = ({ }) => {
    const { data, isLoading } = api.batch.ownUserBatches.useQuery({
        where: {
            name: ''
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
                    data && data.length > 0 && data.map((batch) => {
                        return (
                            <BatchCard
                                key={batch.id}
                                batchName={batch.name}
                                seats={batch.seats}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BatchesContainer;