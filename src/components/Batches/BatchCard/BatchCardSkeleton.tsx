import { Skeleton } from "@/components/ui/skeleton"

const BatchCardSkeleton = () => {
    return (
        <div className="p-4 rounded-md bg-blackNormal flex flex-col gap-3 max-w-40 min-w-40 min-h-48 max-h-48">
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    )
}

export default BatchCardSkeleton;