import { api } from "@/trpc/react";
import { useParams } from 'next/navigation'


const useBatchContainerLogic = () => {
    const params = useParams()

    const { data: batchData, isLoading: batchIsLoading } = api.batch.batchById.useQuery(
        {
            batchId: params.id as string
        }
    );

    return {
        batchData,
        batchIsLoading
    }
}

export default useBatchContainerLogic;