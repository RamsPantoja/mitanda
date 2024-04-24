import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { type CheckContributionData } from "./useContributionRegisterLogic";
import useBatchStore from "../useBatchStore";

type CheckCardProps = {
    status: "SUCCESS" | "DEFAULT"
    batchNumber: number
    batchRegisterId: string
    batchId: string
    userId: string
    onCheck: (input: CheckContributionData) => void
    canEdit: boolean
}

const CheckCard = ({ status, batchNumber, batchRegisterId, batchId, userId, onCheck, canEdit }: CheckCardProps) => {
    const { currentBatchRegisterId } = useBatchStore((state) => state);

    return (
        <Card className="flex flex-col gap-1 items-center justify-center">
            <span className="text-xs text-grayMain text-nowrap font-bold">{batchNumber}</span>
            {
                status === "SUCCESS" &&
                <div className="h-10 w-10 flex items-center justify-center">
                    <BanknotesIcon className="h-6 w-6 text-green-500" />
                </div>
            }
            {
                status === "DEFAULT" && canEdit &&
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        onCheck({
                            batchRegisterId,
                            batchId,
                            userId
                        })
                    }}
                    disabled={currentBatchRegisterId !== batchRegisterId}
                    className={" text-gray-500 hover:text-whiteMain p-0"}
                >
                    <BanknotesIcon className="h-6 w-6" />
                </Button>
            }
            {
                status === "DEFAULT" && !canEdit &&
                <div className="h-10 w-10 flex items-center justify-center">
                    <BanknotesIcon className="h-6 w-6 text-gray-500" />
                </div>
            }
        </Card>
    )
}

export default CheckCard;