import TruncatedTooltip from "@/components/common/TruncatedTooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { type User } from "@/server/services/user"
import { KeyIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "lucide-react"
import { type Session } from "next-auth"
import { type Dispatch, type SetStateAction } from "react"

type ParticipantCardProps = {
    user: User
    session: Session
    ownerId: string
    turn: number,
    isOwnerLogued: boolean,
    openDialog: Dispatch<SetStateAction<boolean>>,
    batchStatus: string,
    setUserId: Dispatch<SetStateAction<string | null>>
}

const ParticipantCard = ({ user, session, ownerId, turn, isOwnerLogued, openDialog, batchStatus, setUserId }: ParticipantCardProps) => {
    return (
        <Card className="flex gap-2 items-center w-full p-2">
            {
                turn && <span className="text-xl text-grayMain font-black mr-2">{turn}</span>
            }
            <Avatar>
                <AvatarImage src={user.image!} />
                <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 w-full overflow-hidden">
                <div className="w-full flex items-center gap-2">
                    <div className="w-full flex overflow-hidden">
                        <TruncatedTooltip
                            tooltipContent={<p className="text-whiteMain">{user.id === session.user.id ? "(Tú)" : ""} {user.name}</p>}
                            text={`${user.id === session.user.id ? "(Tú)" : ""} ${user.name}`}
                            className="text-whiteMain text-sm truncate font-bold"
                        />
                    </div>
                    {
                        ownerId === user.id && <KeyIcon className="h-4 min-w-4 text-greenMain" />
                    }
                    {
                        ownerId !== user.id &&
                         isOwnerLogued && batchStatus === 'NOT_STARTED' &&
                          <TrashIcon onClick={() => {
                            openDialog(true)
                            setUserId(user.id)
                          }} className="h-4 min-w-4 text-gray-500 hover:text-whiteMain cursor-pointer"/>
                    }
                </div>
                <p className=" text-grayMain text-xs truncate">{user.email}</p>
            </div>
        </Card>
    )
}

export default ParticipantCard;