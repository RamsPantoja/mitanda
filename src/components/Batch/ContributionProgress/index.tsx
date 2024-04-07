import { type Batch } from "@/server/services/batch"
import { Slider } from "@nextui-org/slider"
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { numericFormatter } from "react-number-format"
import { type BatchRegister } from "@/server/services/batchRegister"


type ContributionProgressProps = {
    batch: Batch
    batchRegister: BatchRegister | undefined
}

const ContributionProgress = ({ batch, batchRegister }: ContributionProgressProps) => {
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
    }, [contributionGoal]);

    console.log(contributionGoalFormatted);

    return (
        <Card className="flex flex-col bg-blackNormal p-4 gap-2">
            <Slider
                size='md'
                step={1}
                color="primary"
                label={batchRegister !== undefined ? `Ronda ${batchRegister.batchNumber}` : "Ronda 0"}
                showSteps={false}
                maxValue={contributionGoal}
                minValue={0}
                radius='full'
                value={batchRegister !== undefined ? parseFloat(batchRegister.contributionAmount) : 0}
                getValue={() => `MX$${contributionGoalFormatted}`}
                classNames={{
                    track: "border-s-greenMain",
                    filler: "bg-gradient-to-r from-greenMain to-greenMain",
                    label: "text-whiteMain font-bold text-lg",
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