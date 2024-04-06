import BatchInformationSkeleton from "./BatchInformationSkeleton"
import { MitandaButton } from "@/components/common/MitandaButton"
import useBatchInformationLogic from "./useBatchInformationLogic"
import FeedbackMessage from "@/components/common/FeedbackMessage"
import { Fragment } from "react"
import ContributionProgress from "../ContributionProgress"
import { Card } from "@/components/ui/card"

const BatchInformation = () => {
    const {
        startBatchIsPending,
        startBatchMutation,
        batchData,
        batchIsLoading,
        batchIsError
    } = useBatchInformationLogic();

    if (batchIsLoading) {
        return (
            <BatchInformationSkeleton />
        )
    }

    if (!batchIsLoading && (!batchData || batchIsError)) {
        return (
            <Card>
                <FeedbackMessage status="ERROR" message="No se puede obtener la información de la tanda." />
            </Card>
        )
    }

    return (
        <Fragment>
            {
                batchData && <Fragment>
                    <div className="flex gap-2 p-4 justify-between items-center">
                        <div className="flex flex-col gap-2">
                            <p className=" text-whiteMain text-4xl font-black">{batchData.name}</p>
                            <p className=" text-whiteMain text-base font-black">Recuerda que una tanda se basa en la confianza y esfuerzo de los participantes.</p>
                        </div>
                        <MitandaButton
                            onClick={() => {
                                startBatchMutation({
                                    batchId: batchData.id
                                })
                            }}
                            isPending={startBatchIsPending}
                        >
                            Comenzar tanda
                        </MitandaButton>
                    </div>
                    <ContributionProgress
                        batch={batchData}
                    />
                </Fragment>
            }
        </Fragment>
    )
}

export default BatchInformation;