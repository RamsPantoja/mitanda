import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type NotificationCardProps = {
    content: string
    link: string
    iconUrl: string
    seen: boolean
}

const NotificationCard = ({ content, link, iconUrl, seen }: NotificationCardProps) => {
    return (
        <a href={link} className="flex gap-2 w-full p-4 bg-grayStrong hover:bg-blackNormal cursor-pointer">
            <Avatar className="w-7 h-7">
                <AvatarImage src={iconUrl} />
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 w-full">
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <span className="text-whiteMain text-sm">
                        <div className="Container" dangerouslySetInnerHTML={{ __html: content }}></div>
                    </span>
                    <p className="text-grayMain text-xs truncate">1m ago</p>
                </div>
                {
                    !seen && <div className="min-w-2 h-2 rounded-full bg-greenMain">
                        <div className="min-w-2 h-2 rounded-full bg-greenMain animate-ping">
                        </div>
                    </div>
                }
            </div>
        </a>
    )
}

export default NotificationCard;