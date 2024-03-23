"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { KeyIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import BatchForm from "../BatchForm";
import DelayInput from "@/components/common/TimeoutInput";
import { Toggle } from "@/components/ui/toggle";

type BatchMenubarProps = {
    onSearch: (value: string) => void
    onOwnBatches: (pressed: boolean) => void
    displayOnlyOwnBatches: boolean
}

const BatchMenubar = ({ onSearch, onOwnBatches, displayOnlyOwnBatches }: BatchMenubarProps) => {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center relative">
                        <DelayInput
                            className="border-none outline-none text-sm text-whiteMain bg-blackNormal pl-9 placeholder:text-grayMain"
                            type='text'
                            placeholder="Buscar"
                            startIcon={<MagnifyingGlassIcon className="h-5 w-5 text-grayMain absolute left-2" />}
                            onDelay={onSearch}
                        />
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                aria-label="Toggle bold"
                                onPressedChange={onOwnBatches}
                                pressed={displayOnlyOwnBatches}
                                data-state={displayOnlyOwnBatches ? "on" : "off"}
                            >
                                <KeyIcon className="h-6 w-6" />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className=" bg-blackMain border-none">
                            <p className="text-whiteMain">Solo mostrar tandas que te pertenecen</p>
                        </TooltipContent>
                    </Tooltip>
                    <BatchForm />
                </div>
            </div>
        </TooltipProvider>
    )
}

export default BatchMenubar;