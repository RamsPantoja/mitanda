import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ContributionSkeletonCard = () => {
    return (
        <Card className="flex items-center w-full justify-between">
            <div className="flex items-center w-full min-w-40 gap-2 pr-2">
                <Skeleton className="h-10 min-w-10 rounded-full" />
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className=" h-unit-md w-full" />
                </div>
            </div>
            <div className="flex items-center w-full pr-2">
                <Skeleton className=" h-unit-md w-full" />
            </div>
            <div className="flex items-center w-full justify-end">
                <Skeleton className=" h-unit-md w-full" />
            </div>
        </Card>
    )
}

export default ContributionSkeletonCard;