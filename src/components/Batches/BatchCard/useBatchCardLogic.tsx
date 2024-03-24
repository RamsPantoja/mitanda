import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";


const useBatchCardLogic = () => {
    const utils = api.useUtils();
    const [displayDeleteBatchAlert, setDisplayDeleteBatchAlert] = useState<boolean>(false);

    const { mutate: deleteBatchMutation, isPending: deleteBatchMutationIsPending } = api.batch.delete.useMutation({
        onSuccess: async (data) => {
            toast.success(`La tanda <<${data?.name}>> ha sido eliminada`);
            await utils.batch.ownBatches.invalidate();
            await utils.batch.batches.invalidate();
            setDisplayDeleteBatchAlert(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const onDelete = (batchId: string) => {
        deleteBatchMutation({
            batchId
        });
    }

    return {
        onDelete,
        deleteBatchMutationIsPending,
        displayDeleteBatchAlert,
        setDisplayDeleteBatchAlert
    }
}

export default useBatchCardLogic;