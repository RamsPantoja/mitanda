import { Skeleton } from "@/components/ui/skeleton"

const BatchInformationSkeleton = () => {
    return (
        <div className="p-4 rounded-md bg-blackNormal flex gap-8 flex-col">
            <div className="flex gap-2 items-center justify-between w-full">
                <div className="space-y-2 w-full">
                    <Skeleton className="h-unit-2xl w-full max-w-80" />
                    <Skeleton className="h-unit-lg w-full max-w-96" />
                </div>
                <Skeleton className="h-unit-2xl w-full max-w-32" />
            </div>
            <div className="w-full">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-unit-lg w-full max-w-40" />
                        <Skeleton className="h-unit-lg w-full max-w-28" />
                    </div>
                    <Skeleton className=" h-unit-md w-full" />
                    <div className="flex items-center justify-end">
                        <Skeleton className="max-w-40 h-unit-md w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatchInformationSkeleton;