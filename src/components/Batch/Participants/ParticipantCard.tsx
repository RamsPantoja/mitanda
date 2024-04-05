import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { type User } from "@/server/services/user"

type ParticipantCardProps = {
    user: User
}

const ParticipantCard = ({ user }: ParticipantCardProps) => {
    return (
        <Card className="flex gap-2 items-center w-full p-2">
            <Avatar>
                <AvatarImage src={user.image!} />
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 w-full overflow-hidden">
                <p className="text-whiteMain text-sm truncate font-bold">{user.name}</p>
                <p className=" text-grayMain text-xs truncate">{user.email}</p>
            </div>
        </Card>
    )
}

export default ParticipantCard;