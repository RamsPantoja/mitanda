"use client"

import BatchInformation from "./BatchInformation";
import useBatchContainerLogic from "./useBatchContainerLogic";


const BatchContainer = () => {
    const {
        batchData,
        batchIsLoading
    } = useBatchContainerLogic();

    return (
        <div className="flex flex-col gap-4 w-full">
            <BatchInformation 
                isLoading={batchIsLoading}
                batch={batchData}
            />
        </div>
    )
}

export default BatchContainer;