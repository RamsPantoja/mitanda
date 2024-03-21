"use client"

import BatchCard from "./BatchCard";
import BatchMenubar from "./BatchMenubar";
import { Fragment } from "react";
import useBatchesLogic from "./useBatchesLogic";

const BatchesContainer = ({ }) => {

    const {
        data,
        isLoading,
        skeletons,
        onSearchBatch,
    } = useBatchesLogic();
    
    return (
        <div className="flex flex-col gap-6 w-full">
            <BatchMenubar 
                onSearch={onSearchBatch}
            />
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