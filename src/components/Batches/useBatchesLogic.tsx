import { mapSkeletons } from "@/lib/utils"
import { api } from "@/trpc/react"
import BatchCardSkeleton from "./BatchCard/BatchCardSkeleton"
import { useState } from "react"

const useBatchesLogic = () => {
    const [searchBatchName, setSearchBatchName] = useState<string>('')

    const { data, isLoading } = api.batch.ownUserBatches.useQuery({
        where: {
            name: searchBatchName
        }
    })

    const skeletons = mapSkeletons({
        numberOfSkeletons: 10,
        skeleton: <BatchCardSkeleton />
    })

    const onSearchBatch = (value: string) => {
        setSearchBatchName(value);
    }

    return {
        data,
        isLoading,
        skeletons,
        onSearchBatch,
        searchBatchName
    }
}

export default useBatchesLogic;