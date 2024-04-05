import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const ContributionRegisterSkeleton = () => {
    return (
        <Card className="flex gap-2 items-center w-full p-2">
            <div className="flex gap-2 items-center">
                <Skeleton className="h-10 min-w-10 rounded-full" />
                <Skeleton className=" h-unit-md max-w-24 min-w-24" />
            </div>
            <div className="flex gap-2 flex-col w-full">
                <Skeleton className="h-5 min-w-14 max-w-14" />
                <div className="flex gap-2">
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                    <Skeleton className=" w-14 h-14" />
                </div>
            </div>
        </Card>
    )
}

export default ContributionRegisterSkeleton;