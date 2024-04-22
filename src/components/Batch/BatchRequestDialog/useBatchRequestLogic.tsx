import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useBatchRequestLogic = () => {
    const params = useParams();
    const utils = api.useUtils();
    const [displayBatchRequestDialog, setDisplayBatchRequestDialog] = useState<boolean>(false);
    const { data: session } = useSession();

    const { data: batchRequestData, isLoading: batchRequestIsLoading } = api.batchRequest.batchRequest.useQuery({
        batchId: params.id as string,
        status: "SENT"
    });

    const { mutate: checkStartBatchRequestMutation, isPending: checkStartBatchRequestIsPending } = api.batchRequest.checkStartBatchRequest.useMutation({
        onSuccess: async (data) => {
            toast.success("Gracias por confirmar tu participación.");
            setDisplayBatchRequestDialog(false);

            if (data?.status === "ACCEPTED") {
                await utils.batch.batchById.invalidate(); 
            }
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
        if (!batchRequestIsLoading && batchRequestData && session) {
            const requestedUser = batchRequestData.batchRequestsToUsers.find((item) => item.userId === session.user.id);

            if (requestedUser && !requestedUser.check) {
                setDisplayBatchRequestDialog(true);

            }
        }
    }, [batchRequestData, batchRequestIsLoading, session])

    return {
        batchRequestData,
        displayBatchRequestDialog,
        setDisplayBatchRequestDialog,
        checkStartBatchRequestMutation,
        checkStartBatchRequestIsPending
    }
}

export default useBatchRequestLogic;