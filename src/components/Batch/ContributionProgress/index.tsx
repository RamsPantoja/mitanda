import { type Batch } from "@/server/services/batch"
import { Slider } from "@nextui-org/slider"
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { numericFormatter } from "react-number-format"
import { type BatchRegister } from "@/server/services/batchRegister"
import { DateTime } from "luxon"

type ContributionProgressProps = {
    batch: Batch
    batchRegister: BatchRegister
    participantsNumber: number
}

const ContributionProgress = ({ batch, batchRegister, participantsNumber }: ContributionProgressProps) => {
    const contributionGoal = useMemo(() => {
        if (batch) {
            const contributionAmount = parseFloat(batch.contributionAmount);
            return participantsNumber * contributionAmount;
        } else {
            return 0;
        }
    }, [participantsNumber, batch]);

    const contributionGoalFormatted = useMemo(() => {
        return numericFormatter(contributionGoal.toString(), {
            thousandSeparator: ','
        })
    }, [contributionGoal]);

    return (
        <Card className="flex flex-col bg-blackNormal p-4 gap-1">
            <Slider
                size='md'
                step={1}
                color="primary"
                label={`Ronda ${batchRegister.batchNumber}`}
                showSteps={false}
                maxValue={contributionGoal}
                minValue={0}
                radius='full'
                value={parseFloat(batchRegister.contributionAmount)}
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
            <div className="flex items-center justify-end">
                <span className="text-grayMain text-xs">{DateTime.fromJSDate(batchRegister.startDate).toLocaleString(DateTime.DATE_HUGE)} - {DateTime.fromJSDate(batchRegister.endDate).toLocaleString(DateTime.DATE_HUGE)}</span>
            </div>
        </Card>
    )
}

export default ContributionProgress;