import { Card } from "@/components/ui/card"
import ContributionList from "./ContributionList";
import useContributionHistoryLogic from "./useContributionHistoryLogic";

const ContributionHistory = () => {
    const {
        batchContributionData,
        batchContributionIsLoading,
        batchContributionIsError
    } = useContributionHistoryLogic();

    return (
        <Card className="flex flex-col gap-2 flex-[0.5] overflow-hidden">
            <p className="text-whiteMain font-bold text-lg">Historial de contribuciones</p>
            <ContributionList
                isError={batchContributionIsError}
                isLoading={batchContributionIsLoading}
                list={batchContributionData}
            />
        </Card>
    )
}

export default ContributionHistory;