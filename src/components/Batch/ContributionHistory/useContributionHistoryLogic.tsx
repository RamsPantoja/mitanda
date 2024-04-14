import { api } from "@/trpc/react";
import useBatchStore from "../useBatchStore";

const useContributionHistoryLogic = () => {
    const { batch } = useBatchStore((state) => state);

    const {
        data: batchContributionData,
        isLoading: batchContributionIsLoading,
        isError: batchContributionIsError
    } = api.batchContribution.getBatchContributions.useQuery(
        {
            where: {
                batchId: batch?.id
            }
        }
    );

    return {
        batchContributionData,
        batchContributionIsLoading,
        batchContributionIsError
    }
}

export default useContributionHistoryLogic;