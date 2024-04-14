import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/server/services/user";
import CheckCard from "./CheckCard";
import useBatchStore from "../useBatchStore";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

type ContributionRegisterCardProps = {
    user: User
}

const ContributionRegisterCard = ({ user }: ContributionRegisterCardProps) => {
    const { batch } = useBatchStore((state) => state);

    const registers = useMemo(() => {
        if (batch) {
            const registersWithUserContributions = batch.batchRegisters.map((item) => {
                return {
                    ...item,
                    usersContribution: item.batchContributions.map((contribution) => {
                        return contribution.userId
                    })
                }
            });

            return registersWithUserContributions;
        } else {
            return [];
        }
    }, [batch]);

    return (
        <Card className="flex gap-2 flex-col sm:flex-col md:flex-col lg:flex-row w-full items-start">
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
                    {
                        registers.map((register) => {
                            return (
                                <CheckCard
                                    key={register.id.concat(user.id)}
                                    batchNumber={register.batchNumber}
                                    status={register.usersContribution.includes(user.id) ? "SUCCESS" : "DEFAULT"}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </Card>
    )
}

export default ContributionRegisterCard;