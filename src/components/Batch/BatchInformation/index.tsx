import { type Batch } from "@/server/services/batch"
import BatchInformationSkeleton from "./BatchInformationSkeleton"
import { MitandaButton } from "@/components/common/MitandaButton"

type BatchInformationProps = {
    isLoading: boolean
    batch: Batch | undefined
}

const BatchInformation = ({ batch, isLoading }: BatchInformationProps) => {

    if (isLoading) {
        return (
            <BatchInformationSkeleton />
        )
    }

    return (
        <div className="flex gap-2 p-4 justify-between items-center">
            <div className="flex flex-col gap-2">
                <p className=" text-whiteMain text-4xl font-black">{batch?.name}</p>
                <p className=" text-whiteMain text-base font-black">Recuerda que una tanda se basa en la confianza y esfuerzo de los participantes.</p>
            </div>
            <MitandaButton>
                Comenzar tanda
            </MitandaButton>
        </div>
    )
}

export default BatchInformation;