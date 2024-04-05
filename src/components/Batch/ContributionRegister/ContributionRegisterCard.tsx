import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/server/services/user";
import CheckCard from "./CheckCard";

type ContributionRegisterCardProps = {
    user: User
}

const ContributionRegisterCard = ({ user }: ContributionRegisterCardProps) => {
    return (
        <div className="flex gap-2 flex-col sm:flex-col md:flex-col lg:flex-row w-full items-start">
            <div className="flex gap-2 items-center w-full p-2 max-w-40">
                <Avatar>
                    <AvatarImage src={user.image!} />
                    <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <p className="text-whiteMain text-sm truncate font-bold">{user.name}</p>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-grayMain text-nowrap font-bold ml-4 pt-2">Rondas</span>
                <div className="flex items-center w-full flex-wrap">
                    <CheckCard batchNumber={1} status="SUCCESS" />
                    <CheckCard batchNumber={2} status="DEFAULT" />
                    <CheckCard batchNumber={3} status="SUCCESS" />
                    <CheckCard batchNumber={4} status="DEFAULT" />
                    <CheckCard batchNumber={5} status="DEFAULT" />
                    <CheckCard batchNumber={6} status="DEFAULT" />
                    <CheckCard batchNumber={7} status="DEFAULT" />
                    <CheckCard batchNumber={8} status="DEFAULT" />
                    <CheckCard batchNumber={9} status="DEFAULT" />
                    <CheckCard batchNumber={10} status="DEFAULT" />
                </div>
            </div>
        </div>
    )
}

export default ContributionRegisterCard;