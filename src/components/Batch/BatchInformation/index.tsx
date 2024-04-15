import BatchInformationSkeleton from "./BatchInformationSkeleton"
import { MitandaButton } from "@/components/common/MitandaButton"
import useBatchInformationLogic from "./useBatchInformationLogic"
import FeedbackMessage from "@/components/common/FeedbackMessage"
import { Fragment } from "react"
import ContributionProgress from "../ContributionProgress"
import { Card } from "@/components/ui/card"
import TimerComponent from "@/components/common/Timer"
import { DateTime } from "luxon"

type BatchInformationProps = {
    batchIsLoading: boolean
    batchIsError: boolean
}

const BatchInformation = ({ batchIsError, batchIsLoading }: BatchInformationProps) => {
    const {
        startBatchIsPending,
        startBatchMutation,
        currentBatchRegister,
        batch,
        session,
        canContribute,
        setCanContribute,
        batchPaymentLinkIsPending,
        onContribute
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
                            batch.status === "NOT_STARTED" && batch.userId === session?.user.id &&
                            <MitandaButton
                                onClick={() => {
                                    startBatchMutation({
                                        batchId: batch.id
                                    })
                                }}
                                isPending={startBatchIsPending}
                            >
                                Iniciar tanda
                            </MitandaButton>
                        }
                        {
                            batch.status === "IN_PROGRESS" &&
                            <div className="flex flex-col gap-2 items-end">
                                <MitandaButton
                                    disabled={!canContribute}
                                    isPending={batchPaymentLinkIsPending}
                                    onClick={onContribute}
                                >
                                    Dar contribución
                                </MitandaButton>
                                {
                                    currentBatchRegister && canContribute &&
                                    <TimerComponent
                                        start={currentBatchRegister.startDate}
                                        end={DateTime.fromJSDate(currentBatchRegister.startDate).plus({ "days": 2 }).toJSDate()}
                                        onTimerEnds={() => {
                                            setCanContribute(false);
                                        }}
                                    />
                                }
                            </div>

                        }
                    </div>
                    <ContributionProgress
                        batch={batch}
                        batchRegister={currentBatchRegister}
                    />
                </Fragment>
            }
        </Fragment>
    )
}

export default BatchInformation;