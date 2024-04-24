import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useBatchStore from "../useBatchStore";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export type CheckContributionData = {
    userId: string
    batchRegisterId: string
    batchId: string
}

const useContributionRegisterLogic = () => {
    const params = useParams();
    const utils = api.useUtils();
    const { batch, setParticipantIds } = useBatchStore((state) => state);
    const [checkContributionData, setCheckContributionData] = useState<CheckContributionData | null>(null);
    const [displayCheckContributionDialog, setDisplayCheckContributionDialog] = useState<boolean>(false);
    const { data: session } = useSession();

    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });

    const { mutate: addBatchContributionMutation, isPending: addBatchContributionIsPending } = api.batch.addBatchContribution.useMutation({
        onSuccess: async () => {
            toast.success("El registro se agrego correctamente!");
            setDisplayCheckContributionDialog(false);
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
        if (participantsData) {
            setParticipantIds(participantsData.map((item) => item.userId));
        }
    }, [participantsData, setParticipantIds])

    const onCheckContribution = (input: CheckContributionData) => {
        setCheckContributionData(input);
        setDisplayCheckContributionDialog(true);
    }

    const onAddBatchContribution = () => {
        if (checkContributionData) {
            addBatchContributionMutation(checkContributionData);
        }
    }

    const canEdit = useMemo(() => {
        if (batch?.userId === session?.user.id) {
            return true;
        }

        return false;
    }, [batch, session])

    return {
        participantsData,
        participantsIsLoading,
        participantsIsError,
        onCheckContribution,
        displayCheckContributionDialog,
        setDisplayCheckContributionDialog,
        addBatchContributionIsPending,
        onAddBatchContribution,
        batch,
        canEdit
    }
}

export default useContributionRegisterLogic;