"use client"

import Billing from "./Billing";
import BillingForm from "./BillingForm";
import CurrentBalance from "./CurrentBalance";

const BalanceContainer = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <CurrentBalance />
            <BillingForm />
            <Billing />
        </div>
    )
}

export default BalanceContainer;