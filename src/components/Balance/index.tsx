"use client"

import Billing from "./Billing";
import CurrentBalance from "./CurrentBalance";

const BalanceContainer = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <CurrentBalance />
            <Billing />
        </div>
    )
}

export default BalanceContainer;