"use client"

import { BatchCardProps } from "../_types";
import { EllipsisVerticalIcon, ShareIcon } from "@heroicons/react/24/outline";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const BatchCard = ({ batchName }: BatchCardProps) => {
    return (
        <TooltipProvider delayDuration={300}>
            <div className="p-4 rounded-md bg-blackNormal max-w-40 min-w-40 min-h-48 max-h-48 flex flex-col gap-1">
                <div className="flex w-full justify-end">
                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className=" h-8 w-8 p-0 hover:bg-blackMain"><EllipsisVerticalIcon className="h-6 w-6 text-whiteMain" /></Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent className=" bg-blackMain border-none">
                                <p className="text-whiteMain">Más opciones</p>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex flex-col gap-1 h-full">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-whiteMain font-bold text-sm truncate w-fit max-w-full">{batchName}</p>
                        </TooltipTrigger>
                        <TooltipContent className=" bg-blackMain border-none">
                            <p className="text-whiteMain">{batchName}</p>
                        </TooltipContent>
                    </Tooltip>
                    <p className="text-grayMain text-xs truncate w-fit max-w-full">4 participantes</p>
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col">
                        <p className="text-grayMain text-xs">Próximo pago:</p>
                        <span className="text-xs text-greenMain font-bold ">11/02/2024</span>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='ghost' className=" h-8 w-8 p-0 hover:bg-blackMain"><ShareIcon className="h-4 w-4 text-whiteMain" /></Button>
                        </TooltipTrigger>
                        <TooltipContent className=" bg-blackMain border-none">
                            <p className="text-whiteMain">Link de invitación</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}

export default BatchCard;