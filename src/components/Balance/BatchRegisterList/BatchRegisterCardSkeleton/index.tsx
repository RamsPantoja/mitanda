import { Skeleton } from "@/components/ui/skeleton"

const BatchRegisterCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 bg-blackNormal w-[calc(95%/5)] min-w-[150px] rounded-md animate-pulse p-2">
      <Skeleton className=" h-unit-lg w-1/2"/>
      <Skeleton className="h-unit-md w-1/3"/>
    </div>
  )
}

export default BatchRegisterCardSkeleton;