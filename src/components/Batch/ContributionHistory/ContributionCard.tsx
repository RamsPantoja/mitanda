import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DateTime } from "luxon";


const ContributionCard = () => {
    return (
        <Card className="flex justify-between">
            <div className="flex gap-2 items-center min-w-40 w-full">
                <Avatar>
                    <AvatarImage src={""} />
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <span className="text-whiteMain text-sm truncate font-bold">Rams pantoja</span>
                </div>
            </div>
            <div className="flex w-full items-center">
                <span className="text-grayMain text-sm">{DateTime.now().toLocaleString(DateTime.DATE_HUGE)}</span>
            </div>
            <div className="flex w-full items-center justify-end">
                <span className="text-grayMain text-sm">1,000 MXN</span>
            </div>
        </Card>
    )
}

export default ContributionCard;