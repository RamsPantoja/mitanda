import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const CurrentBalance = () => {
    const totalBalance = 0;

    return (
        <TooltipProvider delayDuration={300}>
            <Card className="max-w-80">
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-row flex-wrap items-center gap-4 justify-between">
                        <span className="text-whiteMain font-black text-2xl">{totalBalance} MXN</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InformationCircleIcon className="h-4 w-4 text-whiteMain" />
                            </TooltipTrigger>
                            <TooltipContent className=" bg-blackMain border-none max-w-60">
                                <p className="text-whiteMain">Este es tu saldo total, acumulado de todas las tandas en las que has participado.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </Card>
        </TooltipProvider>
    )
}

export default CurrentBalance;