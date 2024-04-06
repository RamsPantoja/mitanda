"use client"

import BatchInformation from "./BatchInformation";
import ContributionHistory from "./ContributionHistory";
import ContributionRegister from "./ContributionRegister";

const BatchContainer = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <BatchInformation />
            <ContributionRegister />
            <ContributionHistory />
        </div>
    )
}

export default BatchContainer;