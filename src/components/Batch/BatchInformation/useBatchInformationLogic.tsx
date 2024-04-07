import { api } from "@/trpc/react";
import { useMemo } from "react";
import { toast } from "sonner";
import useBatchStore from "../useBatchStore";
import { useSession } from "next-auth/react";

const useBatchInformationLogic = () => {
    const utils = api.useUtils();
    const { batch } = useBatchStore((state) => state);
    const { data: session } = useSession();

    const currentBatchRegister = useMemo(() => {
        return batch?.batchRegisters.find((register) => register.status === 'IN_PROGRESS');
    }, [batch]);

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
        currentBatchRegister,
        batch,
        session
    }
}

export default useBatchInformationLogic;