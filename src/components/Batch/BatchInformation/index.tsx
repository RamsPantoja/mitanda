import { type Batch } from "@/server/services/batch"
import BatchInformationSkeleton from "./BatchContainerSkeleton"

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
        <div className="flex flex-col gap-3 p-4">
            <p className=" text-whiteMain text-4xl font-black">{batch?.name}</p>
            <p className=" text-whiteMain text-base font-black">Recuerda que una tanda se basa en la confianza y esfuerzo de los participantes.</p>
        </div>
    )
}

export default BatchInformation;