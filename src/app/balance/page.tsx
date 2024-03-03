import Billing from "@/components/Balance/Billing";
import CurrentBalance from "@/components/Balance/CurrentBalance";

const Balance = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <CurrentBalance />
            <Billing />
        </div>
    )
}

export default Balance;