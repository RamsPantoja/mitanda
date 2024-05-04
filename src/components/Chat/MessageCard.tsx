import { type Session } from "next-auth";
import { type Message } from ".";
import TruncatedTooltip from "../common/TruncatedTooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";

type MessageCardProps = {
    message: Message
    session: Session
}

const MessageCard = ({ message, session }: MessageCardProps) => {
    return (
        <Card className={cn(
            "flex gap-2 w-full p-2",
            {
                "bg-blackLigth": session.user.id === message.user.id
            }
        )}>
            <Avatar>
                <AvatarImage src={message.user.image} />
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 w-full overflow-hidden">
                <div className="w-full flex items-center gap-2">
                    <div className="w-full flex overflow-hidden">
                        <TruncatedTooltip
                            tooltipContent={<p className="text-whiteMain">{message.user.name}</p>}
                            text={message.user.name}
                            className="text-whiteMain text-xs truncate font-bold"
                        />
                    </div>
                </div>
                <p className="w-full text-grayMain rounded-xl bg-white-ligth flex flex-col flex-nowrap text-sm text-gray-strong break-words">{message.message}</p>
                <span className="text-grayMain text-xs w-full text-right mt-1" >{DateTime.fromJSDate(message.createdAt).toLocaleString(DateTime.DATETIME_SHORT)}</span>
            </div>
        </Card>
    )
}

export default MessageCard;