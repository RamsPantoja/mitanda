import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useBatchStore from "../useBatchStore";

export type CheckContributionData = {
    userId: string
    batchRegisterId: string
    batchId: string
}

const useContributionRegisterLogic = () => {
    const params = useParams();
    const setParticipantIds = useBatchStore((state) => state.setParticipantIds);
    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });
    const [checkContributionData, setCheckContributionData] = useState<CheckContributionData | null>(null);
    const [displayCheckContributionDialog, setDisplayCheckContributionDialog] = useState<boolean>(false);

    console.log(checkContributionData);

    useEffect(() => {
        if (participantsData) {
            setParticipantIds(participantsData.map((item) => item.userId));
        }
    }, [participantsData, setParticipantIds])

    const onCheckContribution = (input: CheckContributionData) => {
        setCheckContributionData(input);
        setDisplayCheckContributionDialog(true);
    }

    return {
        participantsData,
        participantsIsLoading,
        participantsIsError,
        onCheckContribution,
        displayCheckContributionDialog,
        setDisplayCheckContributionDialog
    }
}

export default useContributionRegisterLogic;