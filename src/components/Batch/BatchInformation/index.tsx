import BatchInformationSkeleton from "./BatchInformationSkeleton"
import { MitandaButton } from "@/components/common/MitandaButton"
import useBatchInformationLogic from "./useBatchInformationLogic"
import FeedbackMessage from "@/components/common/FeedbackMessage"
import { Fragment, useMemo } from "react"
import ContributionProgress from "../ContributionProgress"
import { Card } from "@/components/ui/card"
import useBatchStore from "../useBatchStore";

type BatchInformationProps = {
    batchIsLoading: boolean
    batchIsError: boolean
}

const BatchInformation = ({ batchIsError, batchIsLoading }: BatchInformationProps) => {
    const {
        startBatchIsPending,
        startBatchMutation,
    } = useBatchInformationLogic();

    const { batch } = useBatchStore((state) => state);

    const currentBatchRegister = useMemo(() => {
        return batch?.batchRegisters.find((register) => register.status === 'IN_PROGRESS');
    }, [batch]);

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
                    <div className="flex gap-2 p-4 justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <p className=" text-whiteMain text-4xl font-black">{batch.name}</p>
                            <p className=" text-whiteMain text-base font-black">Recuerda que una tanda se basa en la confianza y esfuerzo de los participantes.</p>
                        </div>
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