import { Card } from "@/components/ui/card"
import ContributionList from "./ContributionList";

const ContributionHistory = () => {
    return (
        <Card className="flex flex-col gap-2 flex-[0.5] overflow-hidden">
            <p className="text-whiteMain font-bold text-lg">Historial de contribuciones</p> 
            <ContributionList />
        </Card>
    )
}

export default ContributionHistory;