import BatchCard, { type BatchCardProps } from "./BatchCard";
import BatchMenubar from "./BatchMenubar";

const batches: BatchCardProps[] = [{ batchName: "Mi primera tanda" }, { batchName: "Otra tanda" }, { batchName: "Rams tanda" }];

const BatchesContainer = ({ }) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <BatchMenubar />
            <div className="flex flex-row gap-4 flex-wrap overflow-auto">
                {
                    batches.map((batch, index) => {
                        return (
                            <BatchCard key={index} batchName={batch.batchName} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default BatchesContainer;