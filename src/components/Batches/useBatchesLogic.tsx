import { mapSkeletons } from "@/lib/utils"
import { api } from "@/trpc/react"
import BatchCardSkeleton from "./BatchCard/BatchCardSkeleton"
import { useState } from "react"

const useBatchesLogic = () => {
    const [searchBatchName, setSearchBatchName] = useState<string>('')
    const [displayOnlyOwnBatches, setDisplayOnlyOwnBatches] = useState<boolean>(false);

    const { data: ownBatchesData, isLoading: ownBatchesIsLoading, error: ownBatchesError } = api.batch.ownBatches.useQuery(
        {
            where: {
                name: searchBatchName
            }
        },
        {
            enabled: displayOnlyOwnBatches
        }
    );

    const { data: batchesData, isLoading: batchesIsLoading, error: batchesError } = api.batch.batches.useQuery(
        {
            where: {
                name: searchBatchName
            }
        },
        {
            enabled: !displayOnlyOwnBatches
        }
    );

    const skeletons = mapSkeletons({
        numberOfSkeletons: 10,
        skeleton: <BatchCardSkeleton />
    })

    const onSearchBatch = (value: string) => {
        setSearchBatchName(value);
    }

    const onOwnBatches = (pressed: boolean) => {
        setDisplayOnlyOwnBatches(pressed);
    }

    return {
        ownBatchesData,
        ownBatchesIsLoading,
        skeletons,
        onSearchBatch,
        searchBatchName,
        displayOnlyOwnBatches,
        onOwnBatches,
        batchesData,
        batchesIsLoading,
        ownBatchesError,
        batchesError
    }
}

export default useBatchesLogic;