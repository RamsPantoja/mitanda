import { api } from "@/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useBatchStore from "../useBatchStore";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";

const useBatchInformationLogic = () => {
    const utils = api.useUtils();
    const { batch } = useBatchStore((state) => state);
    const { data: session } = useSession();
    const [canContribute, setCanContribute] = useState<boolean>(true);

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

    useEffect(() => {
        if (currentBatchRegister) {
            const startDate = DateTime.fromJSDate(currentBatchRegister.startDate);
            const nowDate = DateTime.now()
            const diffInDays = nowDate.diff(startDate, "days").toObject();


            if (diffInDays.days && diffInDays.days !== undefined && diffInDays.days >= 2) {
                setCanContribute(false);
            }
        }
    }, [currentBatchRegister]);

    return {
        startBatchIsPending,
        startBatchMutation,
        currentBatchRegister,
        batch,
        session,
        canContribute,
        setCanContribute
    }
}

export default useBatchInformationLogic;