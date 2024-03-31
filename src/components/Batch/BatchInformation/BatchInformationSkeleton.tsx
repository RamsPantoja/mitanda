import { Skeleton } from "@/components/ui/skeleton"

const BatchInformationSkeleton = () => {
    return (
        <div className="p-4 rounded-md bg-blackNormal flex gap-2 items-center justify-between">
            <div className="space-y-2 w-full">
                <Skeleton className="h-unit-2xl w-full max-w-80" />
                <Skeleton className="h-unit-lg w-full max-w-96" />
            </div>
            <Skeleton className="h-unit-2xl w-full max-w-32" />
        </div>
    )
}

export default BatchInformationSkeleton;