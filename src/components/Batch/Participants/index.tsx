"use client"

import { api } from "@/trpc/react"
import ParticipantSkeleton from "./ParticipantSkeleton";
import { useParams } from "next/navigation";
import ParticipantCard from "./ParticipantCard";
import { Fragment, useMemo } from "react";
import { type Session } from "next-auth";

type BatchTurn = Record<string, number>

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

    const batchTurnByUser = useMemo(() => {
        if (batchData) {
            return batchData.batchRegisters.reduce<BatchTurn>((obj, item) => {
                obj = {
                    ...obj,
                    [item.recipientId]: item.batchNumber
                };

                return obj;
            }, {});
        }
    }, [batchData]);

    return (
        <div className="flex flex-col gap-2 h-full">
            <p className="text-lg font-bold text-whiteMain">Participantes y turnos</p>
            <div className="h-full flex flex-col overflow-auto">
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
                    batchTurnByUser &&
                    participantsData?.map((item) => {
                        return (
                            <ParticipantCard
                                key={item.userId}
                                user={item.user}
                                session={session}
                                ownerId={batchData.userId}
                                turn={batchTurnByUser[item.userId]!}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Participants;