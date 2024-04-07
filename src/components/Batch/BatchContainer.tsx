"use client"

import BatchInformation from "./BatchInformation";
import ContributionHistory from "./ContributionHistory";
import ContributionRegister from "./ContributionRegister";
import useBatchContainerLogic from "./useBatchContainerLogic";

const BatchContainer = () => {
    const {
        batchIsLoading,
        batchIsError
    } = useBatchContainerLogic();

    return (
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
    )
}

export default BatchContainer;