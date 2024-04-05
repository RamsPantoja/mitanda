import { Card } from "@/components/ui/card";
import { BanknotesIcon } from "@heroicons/react/24/outline";

type CheckCardProps = {
    status: "SUCCESS" | "DEFAULT"
    batchNumber: number
}

const CheckCard = ({ status, batchNumber }: CheckCardProps) => {
    return (
        <Card className="flex flex-col gap-1 items-center justify-center">
            <span className="text-xs text-grayMain text-nowrap font-bold">{batchNumber}</span>
            {
                status === 'DEFAULT' && <BanknotesIcon className="h-6 w-6 text-gray-500" />
            }
            {
                status === "SUCCESS" && <BanknotesIcon className="h-6 w-6 text-green-500" />
            }
        </Card>
    )
}

export default CheckCard;