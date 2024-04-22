import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useBatchRequestLogic = () => {
    const params = useParams();
    const [displayBatchRequestDialog, setDisplayBatchRequestDialog] = useState<boolean>(false);
    const { data: session } = useSession();

    const { data: batchRequestData, isLoading: batchRequestIsLoading } = api.batchRequest.batchRequest.useQuery({
        batchId: params.id as string,
        status: "SENT"
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
        setDisplayBatchRequestDialog
    }
}

export default useBatchRequestLogic;