"use client"

import CurrentBalance from "./CurrentBalance";
import BatchRegisterList from "./BatchRegisterList";

const BalanceContainer = () => {
    return (
        <div className="flex flex-col gap-2 w-full ">
            <div className="flex flex-row flex-wrap gap-2">
                <CurrentBalance />
            </div>
            <BatchRegisterList />
        </div>
    )
}

export default BalanceContainer;