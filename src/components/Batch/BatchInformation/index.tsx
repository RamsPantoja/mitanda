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
import { CheckIcon, InformationCircleIcon, ShareIcon } from "@heroicons/react/24/outline"
import CustomAlertDialog from "@/components/common/AlertDialog"
import { numericFormatter } from "react-number-format"
import { Button } from "@/components/ui/button"

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
        startBatchIsPending,
        startBatchMutation,
        handleCopyInviteLink,
        inviteLinkCopied,
        setInviteLinkCopied
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
                    <div className="flex gap-4 p-4 justify-between items-center bg-blackLigth sm:flex-col md:flex-col lg:flex-row">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <p className=" text-whiteMain text-4xl font-black">{batch.name}</p>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className=" h-8 w-8 p-0 hover:bg-blackMain"
                                            onClick={async () => {
                                                await handleCopyInviteLink(batch.id);
                                            }}
                                            onMouseLeave={() => {
                                                if (inviteLinkCopied) {
                                                    setTimeout(() => {
                                                        setInviteLinkCopied(false);
                                                    }, 1000);
                                                }
                                            }}
                                        >
                                            {
                                                inviteLinkCopied ? <CheckIcon className="h-4 w-4 text-whiteMain" /> : <ShareIcon className="h-4 w-4 text-whiteMain" />
                                            }
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className=" bg-blackMain border-none">
                                        <p className="text-whiteMain">Link de invitación</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <span className="text-greenMain text-base font-bold">
                                MX${numericFormatter(batch.contributionAmount, { thousandSeparator: ',' })} de contribución
                            </span>
                            <p className=" text-grayMain text-base">¡No olvides que en una tanda, todos ponemos confianza y esfuerzo!</p>
                        </div>
                        {
                            batch.status === "NOT_STARTED" && batch.userId === session?.user.id && participantIds &&
                            <div className="flex items-center gap-2">
                                <CustomAlertDialog
                                    cancelText="Cancelar"
                                    actionText="Iniciar"
                                    title="Iniciar tanda"
                                    description={`Estás a punto de inciar la tanda. Puedes cancelar esta operación si así lo deseas.`}
                                    onCancel={() => {
                                        setDisplayAlertForInitBatch(false);
                                    }}
                                    onAction={() => {
                                        startBatchMutation({
                                            batchId: batch.id,
                                            participantIds
                                        })
                                    }}
                                    isPending={startBatchIsPending}
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