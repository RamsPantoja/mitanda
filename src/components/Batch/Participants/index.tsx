"use client"

import { api } from "@/trpc/react"
import ParticipantSkeleton from "./ParticipantSkeleton";
import { useParams } from "next/navigation";
import ParticipantCard from "./ParticipantCard";
import { Fragment } from "react";
import { type Session } from "next-auth";

type ParticipantsProps = {
    session: Session
}

const Participants = ({ session }: ParticipantsProps) => {
    const params = useParams()
    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });

    const { data: batchData, isLoading: batchIsLoading, isError: batchIsError } = api.batch.batchById.useQuery(
        {
            batchId: params.id as string,
        }
    );

    return (
        <div className="flex flex-col gap-2 h-full">
            <p className="text-lg font-bold text-whiteMain">Participantes</p>
            <div className="h-full flex flex-col">
                {
                    (participantsIsLoading || batchIsLoading) &&
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
                    batchData &&
                    !batchIsLoading &&
                    !batchIsError &&
                    !participantsIsLoading &&
                    !participantsIsError &&
                    participantsData?.map((item) => {
                        return (
                            <ParticipantCard
                                key={item.userId}
                                user={item.user}
                                session={session}
                                ownerId={batchData.userId}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Participants;