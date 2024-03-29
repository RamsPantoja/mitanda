"use client"

import BatchInformation from "./BatchInformation";
import ContributionProgress from "./ContributionProgress";
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
            <ContributionProgress
                batch={batchData}
                isLoading={batchIsLoading}
            />
        </div>
    )
}

export default BatchContainer;