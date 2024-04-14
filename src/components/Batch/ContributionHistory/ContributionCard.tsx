import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { type User } from "@/server/services/user";
import { DateTime } from "luxon";
import { numericFormatter } from "react-number-format";

type ContributionCardProps = {
    user: User
    createdAt: Date
    amount: string
}

const ContributionCard = ({ user, amount, createdAt }: ContributionCardProps) => {
    const contributionAmountFormatted = numericFormatter(amount, {
        thousandSeparator: ','
    });

    return (
        <Card className="flex justify-between">
            <div className="flex gap-2 items-center min-w-40 w-full">
                <Avatar>
                    <AvatarImage src={user.image!} />
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <span className="text-whiteMain text-sm truncate font-bold">{user.name}</span>
                </div>
            </div>
            <div className="flex w-full items-center">
                <span className="text-grayMain text-sm">{DateTime.fromJSDate(createdAt).toLocaleString(DateTime.DATE_HUGE)}</span>
            </div>
            <div className="flex w-full items-center justify-end">
                <span className="text-grayMain text-sm">{contributionAmountFormatted} MX</span>
            </div>
        </Card>
    )
}

export default ContributionCard;