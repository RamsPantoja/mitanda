import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useBatchStore from "../useBatchStore";

const useContributionRegisterLogic = () => {
    const params = useParams();
    const setParticipantIds = useBatchStore((state) => state.setParticipantIds);
    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });

    useEffect(() => {
        if (participantsData) {
            setParticipantIds(participantsData.map((item) => item.userId));
        }
    }, [participantsData, setParticipantIds])

    return {
        participantsData,
        participantsIsLoading,
        participantsIsError
    }
}

export default useContributionRegisterLogic;