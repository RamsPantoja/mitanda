import { Skeleton } from "@/components/ui/skeleton";


const ContributionProgressSkeleton = () => {
    return (
        <div className="p-4 rounded-md bg-blackNormal flex flex-col max-w-xl">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-unit-lg w-full max-w-40" />
                    <Skeleton className="h-unit-lg w-full max-w-28" />
                </div>
                <Skeleton className=" h-unit-lg w-full" />
            </div>
        </div>
    )
}

export default ContributionProgressSkeleton;