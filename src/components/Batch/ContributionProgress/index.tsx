import { type Batch } from "@/server/services/batch"
import { Slider } from "@nextui-org/slider"
import { useMemo } from "react"
import ContributionProgressSkeleton from "./ContributionProgressSkeleton"
import { Card } from "@/components/ui/card"
import { numericFormatter } from "react-number-format"


type ContributionProgressProps = {
    batch: Batch | undefined
    isLoading: boolean
}

const ContributionProgress = ({ batch, isLoading }: ContributionProgressProps) => {
    const contributionGoal = useMemo(() => {
        if (batch) {
            const contributionAmount = parseFloat(batch.contributionAmount);
            return batch.seats * contributionAmount;
        } else {
            return 0;
        }
    }, [batch]);

    const contributionGoalFormatted = useMemo(() => {
        return numericFormatter(contributionGoal.toString(), {
            thousandSeparator: ','
        })
    }, [contributionGoal])

    if (isLoading) {
        return <ContributionProgressSkeleton />
    }

    return (
        <Card className="flex items-center bg-blackNormal justify-end max-w-xl p-4">
            <Slider
                size='md'
                step={1}
                color="primary"
                label="Progreso de contribuciones"
                showSteps={false}
                maxValue={contributionGoal}
                minValue={0}
                radius='full'
                value={6000}
                getValue={() => `MX$${contributionGoalFormatted}`}
                classNames={{
                    track: "border-s-greenMain",
                    filler: "bg-gradient-to-r from-greenMain to-greenMain",
                    label: "text-whiteMain",
                    value: "text-whiteMain font-bold",
                    thumb: [
                        "transition-size",
                        "bg-gradient-to-r from-blackMain to-blackMain",
                        "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                        "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6"
                    ],
                }}
                formatOptions={{ style: "currency", currency: "MXN" }}
                showTooltip={true}

            />
        </Card>
    )
}

export default ContributionProgress;