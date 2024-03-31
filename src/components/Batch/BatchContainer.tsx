"use client"

import BatchInformation from "./BatchInformation";
import ContributionHistory from "./ContributionHistory";
import ContributionProgress from "./ContributionProgress";
import ContributionRegister from "./ContributionRegister";
import useBatchContainerLogic from "./useBatchContainerLogic";

const BatchContainer = () => {
    const {
        batchData,
        batchIsLoading
    } = useBatchContainerLogic();

    return (
        <div className="flex flex-col gap-2 w-full">
            <BatchInformation
                isLoading={batchIsLoading}
                batch={batchData}
            />
            <ContributionProgress
                batch={batchData}
                isLoading={batchIsLoading}
            />
            <ContributionRegister />
            <ContributionHistory />
        </div>
    )
}

export default BatchContainer;