import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useBatchStore from "./useBatchStore";

const useBatchContainerLogic = () => {
    const params = useParams();
    const setBatch = useBatchStore((state) => state.setBatch);

    const { data: batchData, isLoading: batchIsLoading, isError: batchIsError } = api.batch.batchById.useQuery(
        {
            batchId: params.id as string,
        }
    );
    
    useEffect(() => {
        if (batchData) {
            setBatch(batchData);
        }
    }, [batchData, setBatch])

    return {
        batchIsLoading,
        batchIsError
    }
}

export default useBatchContainerLogic;