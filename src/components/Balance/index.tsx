"use client"

import Billing from "./Billing";
import CurrentBalance from "./CurrentBalance";
import Withdrawals from "./Withdrawals";

const BalanceContainer = () => {
    return (
        <div className="flex flex-row gap-4 w-full ">
            <div className="flex flex-col gap-4 w-1/5">
                <CurrentBalance />
                <Billing />
            </div>
            <Withdrawals/>
        </div>
    )
}

export default BalanceContainer;