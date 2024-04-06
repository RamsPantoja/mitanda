import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const useBatchInformationLogic = () => {
    const params = useParams()

    const { data: batchData, isLoading: batchIsLoading, isError: batchIsError } = api.batch.batchById.useQuery(
        {
            batchId: params.id as string
        }
    );

    const { mutate: startBatchMutation, isPending: startBatchIsPending } = api.batch.startBatch.useMutation({
        onSuccess: () => {
            toast.success("Muy bien! La tanda ha comenzado.")
        },
        onError: (error) => {
            toast.error("Algo salió mal!", {
                description: error.message,
                action: {
                    label: 'Enviar reporte',
                    onClick: () => console.log("R")
                },
            })
        }
    });

    return {
        startBatchIsPending,
        startBatchMutation,
        batchData,
        batchIsLoading,
        batchIsError
    }
}

export default useBatchInformationLogic;