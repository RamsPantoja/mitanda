import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DateTime } from "luxon";

type NotificationCardProps = {
    content: string
    link: string
    iconUrl: string
    seen: boolean
    createdAt: Date
    onSee: (notificationId: string) => void
    id: string
}

const NotificationCard = ({ content, link, iconUrl, seen, createdAt, onSee, id }: NotificationCardProps) => {
    const timeElapsed = (createdAt: Date) => {
        const elapsed = DateTime.now().diff(DateTime.fromJSDate(createdAt), ['days', "hours", "minutes"]);
        const elapsedObject = elapsed.toObject();

        if (elapsedObject.days && elapsedObject.days > 0) {
            return `hace ${elapsedObject.days} días`
        }

        if (elapsedObject.hours && elapsedObject.hours > 0) {
            return `hace ${elapsedObject.hours} horas`
        }

        if (elapsedObject.minutes && elapsedObject.minutes > 0) {
            return `hace ${elapsedObject.minutes} minutos`
        }

        return "Ahora"
    };

    return (
        <Link href={link} onClick={() => onSee(id)} className="flex gap-2 w-full p-4 bg-blackNormal hover:bg-blackMain cursor-pointer">
            <Avatar className="w-7 h-7">
                <AvatarImage src={iconUrl} />
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 w-full">
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <span className="text-whiteMain text-sm">
                        <div className="Container" dangerouslySetInnerHTML={{ __html: content }}></div>
                    </span>
                    <p className="text-grayMain text-xs truncate">{timeElapsed(createdAt)}</p>
                </div>
                {
                    !seen && <div className="min-w-2 h-2 rounded-full bg-greenMain">
                        <div className="min-w-2 h-2 rounded-full bg-greenMain animate-ping">
                        </div>
                    </div>
                }
            </div>
        </Link>
    )
}

export default NotificationCard;