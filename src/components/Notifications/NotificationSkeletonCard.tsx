import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeletonCard = () => {
    return (
        <Card className="flex gap-2 w-full p-4 bg-blackNormal rounded-none">
            <div className="flex w-full min-w-40 gap-2 pr-2">
                <Skeleton className="h-7 min-w-7 rounded-full" />
                <div className="flex flex-col gap-2 w-full">
                    <Skeleton className=" h-unit-lg w-full" />
                    <Skeleton className=" h-unit-sm w-full" />
                </div>
            </div>
        </Card>
    )
}

export default NotificationSkeletonCard;