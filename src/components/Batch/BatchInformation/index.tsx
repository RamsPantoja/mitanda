import BatchInformationSkeleton from "./BatchInformationSkeleton"
import { MitandaButton } from "@/components/common/MitandaButton"
import useBatchInformationLogic from "./useBatchInformationLogic"
import FeedbackMessage from "@/components/common/FeedbackMessage"
import { Fragment } from "react"
import ContributionProgress from "../ContributionProgress"
import { Card } from "@/components/ui/card"
// import TimerComponent from "@/components/common/Timer"
// import { DateTime } from "luxon"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import CustomAlertDialog from "@/components/common/AlertDialog"

type BatchInformationProps = {
    batchIsLoading: boolean
    batchIsError: boolean
}

const BatchInformation = ({ batchIsError, batchIsLoading }: BatchInformationProps) => {
    const {
        currentBatchRegister,
        batch,
        session,
        // canContribute,
        // setCanContribute,
        // batchPaymentLinkIsPending,
        // onContribute,
        participantIds,
        setDisplayAlertForInitBatch,
        displayAlertForInitBatch,
        startBatchRequestIsPending,
        startBatchRequestMutation
    } = useBatchInformationLogic();

    if (batchIsLoading) {
        return (
            <BatchInformationSkeleton />
        )
    }

    if (!batchIsLoading && batchIsError) {
        return (
            <Card>
                <FeedbackMessage status="ERROR" message="No se puede obtener la información de la tanda." />
            </Card>
        )
    }

    return (
        <Fragment>
            {
                batch && <Fragment>
                    <div className="flex gap-2 p-4 justify-between items-center sticky top-0 z-[1] bg-blackLigth">
                        <div className="flex flex-col gap-2">
                            <p className=" text-whiteMain text-4xl font-black">{batch.name}</p>
                            <p className=" text-grayMain text-base">¡No olvides que en una tanda, todos ponemos confianza y esfuerzo!</p>
                        </div>
                        {
                            batch.status === "NOT_STARTED" && batch.userId === session?.user.id && participantIds &&
                            <div className="flex items-center gap-2">
                                <CustomAlertDialog
                                    cancelText="Cancelar"
                                    actionText="Enviar"
                                    title="Solicitud para iniciar tanda"
                                    description={`Estás a punto de enviar una solicitud a todos los participantes para inciar la tanda. Puedes cancelar esta operación si así lo deseas.`}
                                    onCancel={() => {
                                        setDisplayAlertForInitBatch(false);
                                    }}
                                    onAction={() => {
                                        startBatchRequestMutation({
                                            batchId: batch.id,
                                            participantIds
                                        })
                                    }}
                                    isPending={startBatchRequestIsPending}
                                    open={displayAlertForInitBatch}
                                />
                                <MitandaButton
                                    disabled={participantIds.length < 2}
                                    onClick={() => {
                                        setDisplayAlertForInitBatch(true);
                                    }}
                                >
                                    Iniciar tanda
                                </MitandaButton>
                                {
                                    participantIds.length < 2 &&
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <InformationCircleIcon className="h-6 w-6 text-grayMain" />
                                        </TooltipTrigger>
                                        <TooltipContent className=" bg-blackMain border-none max-w-60">
                                            <p className="text-whiteMain">Para iniciar la tanda, al menos 2 participantes son necesarios</p>
                                        </TooltipContent>
                                    </Tooltip>
                                }
                            </div>
                        }
                        {/* {
                            batch.status === "IN_PROGRESS" && currentBatchRegister &&
                            <div className="flex flex-col gap-2 items-end">
                                <MitandaButton
                                    disabled={!canContribute}
                                    isPending={batchPaymentLinkIsPending}
                                    onClick={onContribute}
                                >
                                    Dar contribución
                                </MitandaButton>
                                {
                                    canContribute &&
                                    <TimerComponent
                                        start={currentBatchRegister.startDate}
                                        end={DateTime.fromJSDate(currentBatchRegister.startDate).plus({ "days": 2 }).toJSDate()}
                                        onTimerEnds={() => {
                                            setCanContribute(false);
                                        }}
                                    />
                                }
                            </div>
                        } */}
                    </div>
                    {
                        currentBatchRegister && participantIds &&
                        <ContributionProgress
                            batch={batch}
                            batchRegister={currentBatchRegister}
                            participantsNumber={participantIds.length}
                        />
                    }
                </Fragment>
            }
        </Fragment>
    )
}

export default BatchInformation;