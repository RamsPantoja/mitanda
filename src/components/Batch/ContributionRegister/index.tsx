"use client"

import { Card } from "@/components/ui/card";
import useContributionRegisterLogic from "./useContributionRegisterLogic";
import { Fragment } from "react";
import ContributionRegisterCard from "./ContributionRegisterCard";
import ContributionRegisterSkeleton from "./ContributionRegisterSkeleton";
import FeedbackMessage from "@/components/common/FeedbackMessage";
import { mapSkeletons } from "@/lib/utils";
import CustomAlertDialog from "@/components/common/AlertDialog";

type ContributionRegisterProps = {
    batchIsLoading: boolean
    batchIsError: boolean
}

const ContributionRegister = ({ batchIsError, batchIsLoading }: ContributionRegisterProps) => {
    const {
        participantsData,
        participantsIsLoading,
        participantsIsError,
        onCheckContribution,
        displayCheckContributionDialog,
        setDisplayCheckContributionDialog,
        addBatchContributionIsPending,
        onAddBatchContribution,
        batch,
        canEdit
    } = useContributionRegisterLogic();

    const skeletons = mapSkeletons({ numberOfSkeletons: 10, skeleton: <ContributionRegisterSkeleton /> });

    return (
        <Card className="flex flex-col gap-2 h-full overflow-hidden">
            <p className="text-whiteMain text-lg font-bold">Registro de contribuciones</p>
            <span className="text-grayMain text-sm">Dá click en el icóno de billete para registrar la contribución del participante.</span>
            {
                (participantsIsLoading || batchIsLoading) && skeletons.map((skeleton, index) => {
                    return <Fragment key={index}>
                        {skeleton}
                    </Fragment>
                })
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
            <CustomAlertDialog
                cancelText="Cancelar"
                actionText="Confirmar"
                title="Registrar contribución"
                description={"¡Atención! ¿Estás seguro de que quieres registrar la contribución del participante?"}
                onCancel={() => {
                    setDisplayCheckContributionDialog(false);
                }}
                onAction={onAddBatchContribution}
                isPending={addBatchContributionIsPending}
                open={displayCheckContributionDialog}
            />
            {
                batch &&
                batch.status !== "NOT_STARTED" &&
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
                                    onCheck={onCheckContribution}
                                    canEdit={canEdit}
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