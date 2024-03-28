import { Skeleton } from "@/components/ui/skeleton"

const BatchInformationSkeleton = () => {
    return (
        <div className="p-4 rounded-md bg-blackNormal flex flex-col gap-3">
            <div className="space-y-2">
                <Skeleton className=" h-unit-2xl w-full max-w-80" />
                <Skeleton className=" h-unit-lg w-full max-w-96" />
            </div>
        </div>
    )
}

export default BatchInformationSkeleton;