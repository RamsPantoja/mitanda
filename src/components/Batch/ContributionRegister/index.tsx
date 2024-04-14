"use client"

import { Card } from "@/components/ui/card";
import useContributionRegisterLogic from "./useContributionRegisterLogic";
import { Fragment } from "react";
import ContributionRegisterCard from "./ContributionRegisterCard";
import ContributionRegisterSkeleton from "./ContributionRegisterSkeleton";
import useBatchStore from "../useBatchStore";
import FeedbackMessage from "@/components/common/FeedbackMessage";

type ContributionRegisterProps = {
    batchIsLoading: boolean
    batchIsError: boolean
}

const ContributionRegister = ({ batchIsError, batchIsLoading }: ContributionRegisterProps) => {
    const {
        participantsData,
        participantsIsLoading,
        participantsIsError
    } = useContributionRegisterLogic();

    const { batch } = useBatchStore((state) => state);

    return (
        <Card className="flex flex-col gap-2 flex-[0.5] overflow-hidden">
            <p className="text-whiteMain text-lg font-bold">Registro de contribuciones</p>
            {
                (participantsIsLoading || batchIsLoading) &&
                <Fragment>
                    <ContributionRegisterSkeleton />
                    <ContributionRegisterSkeleton />
                </Fragment>
            }
            {
                !batchIsLoading &&
                batchIsError &&
                <FeedbackMessage status="ERROR" message="Algo salio mal! No se puede obtener la información de la tanda." />
            }
            {
                !participantsIsLoading &&
                participantsIsError &&
                <FeedbackMessage status="ERROR" message="Algo salio mal! No se pueden obtener las contribuciones." />
            }
            {
                batch &&
                batch.status === 'IN_PROGRESS' &&
                !participantsIsLoading &&
                !participantsIsError &&
                participantsData &&
                <div className="h-full flex flex-col overflow-auto">
                    {
                        participantsData?.map((item) => {
                            return (
                                <ContributionRegisterCard
                                    key={item.userId}
                                    user={item.user}
                                />
                            )
                        })
                    }
                </div>
            }
            {
                batch && batch.status === 'NOT_STARTED' && <FeedbackMessage status="INFORMATION" message="Para visualizar los registros de contribuciones, es necesario iniciar la tanda." />
            }
        </Card >
    )
}

export default ContributionRegister;