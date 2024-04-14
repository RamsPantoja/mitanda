import { Skeleton } from "@/components/ui/skeleton"

export default function BillingInformationSkeleton() {
  return (
    <div className='flex flex-col gap-2 w-3/12'>
      <Skeleton className='w-full h-unit-md animate-pulse'/>
      <Skeleton className='w-32 h-unit-xl animate-pulse'/>
    </div>
  )
}
