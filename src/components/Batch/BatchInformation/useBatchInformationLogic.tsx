import { api } from "@/trpc/react";
import { toast } from "sonner";

const useBatchInformationLogic = () => {
    const utils = api.useUtils();

    const { mutate: startBatchMutation, isPending: startBatchIsPending } = api.batch.startBatch.useMutation({
        onSuccess: async () => {
            toast.success("Muy bien! La tanda ha comenzado.")
            await utils.batch.batchById.invalidate();
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
    }
}

export default useBatchInformationLogic;