import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

const useContributionRegisterLogic = () => {
    const params = useParams()
    const { data: participantsData, isLoading: participantsIsLoading, isError: participantsIsError } = api.userToBatch.getParticipantsFromBatch.useQuery({
        batchId: params.id as string
    });

    return {
        participantsData,
        participantsIsLoading,
        participantsIsError
    }
}

export default useContributionRegisterLogic;