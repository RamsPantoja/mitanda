"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import BatchForm from "../BatchForm";

const BatchMenubar = ({ }) => {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center relative">
                        <MagnifyingGlassIcon className="h-5 w-5 text-grayMain absolute left-2" />
                        <Input className="border-none outline-none text-sm text-whiteMain bg-blackNormal pl-9 placeholder:text-grayMain" type='text' placeholder="Buscar" />
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='ghost' className="hover:bg-blackNormal"><AdjustmentsHorizontalIcon className="h-6 w-6 text-whiteMain" /></Button>
                        </TooltipTrigger>
                        <TooltipContent className=" bg-blackMain border-none">
                            <p className="text-whiteMain">Filtros</p>
                        </TooltipContent>
                    </Tooltip>
                    <BatchForm />
                </div>
            </div>
        </TooltipProvider>
    )
}

export default BatchMenubar;