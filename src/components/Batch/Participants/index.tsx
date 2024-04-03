"use client"

import { api } from "@/trpc/react"
import ParticipantSkeleton from "./ParticipantSkeleton";
import { useParams } from "next/navigation";
import ParticipantCard from "./ParticipantCard";
import { Fragment } from "react";

const Participants = () => {
    const params = useParams()
    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });

    return (
        <div className="flex flex-col gap-2 h-full">
            <p className="text-base font-bold text-whiteMain">Participantes</p>
            <div className="h-full flex flex-col">
                {
                    participantsIsLoading &&
                    <Fragment>
                        <ParticipantSkeleton />
                        <ParticipantSkeleton />
                        <ParticipantSkeleton />
                        <ParticipantSkeleton />
                        <ParticipantSkeleton />
                        <ParticipantSkeleton />
                    </Fragment>
                }
                {
                    !participantsIsLoading && !participantsIsError && participantsData?.map((item) => {
                        return (
                            <ParticipantCard
                                key={item.userId}
                                user={item.user}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Participants;