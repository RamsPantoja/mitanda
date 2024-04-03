import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const ParticipantSkeleton = () => {
    return (
        <Card className="flex gap-2 items-center w-full p-2">
            <Skeleton className="h-10 min-w-10 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
                <Skeleton className=" h-unit-md w-full" />
                <Skeleton className="h-unit-sm w-full" />
            </div>
        </Card>
    )
}

export default ParticipantSkeleton;