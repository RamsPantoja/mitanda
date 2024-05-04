"use client"

import { ShareIcon, KeyIcon, CheckIcon } from "@heroicons/react/24/outline";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { numericFormatter } from "react-number-format";
import { useSession } from "next-auth/react";
import useBatchCardLogic from "./useBatchCardLogic";
import { TranslatedBatchStatus, type BatchStatus } from "@/lib/enum";
import CustomAlertDialog from "@/components/common/AlertDialog";
import TruncatedTooltip from "@/components/common/TruncatedTooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BatchCardProps = {
    batchName: string
    seats: number
    contributionAmount: string
    ownerId: string
    status: BatchStatus
    id: string
}


const BatchCard = ({ batchName, seats, contributionAmount, ownerId, id, status }: BatchCardProps) => {
    const { data: session } = useSession();

    const contributionAmountFormatted = numericFormatter(contributionAmount, {
        thousandSeparator: ','
    });

    const {
        onDelete,
        deleteBatchMutationIsPending,
        displayDeleteBatchAlert,
        setDisplayDeleteBatchAlert,
        handleCopyInviteLink,
        inviteLinkCopied,
        setInviteLinkCopied
    } = useBatchCardLogic();

    return (
        <TooltipProvider delayDuration={150}>
            <CustomAlertDialog
                cancelText="Cancelar"
                actionText="Eliminar"
                title="Eliminar tanda"
                description={`Estás a punto de eliminar la tanda <<${batchName}>>. Puedes cancelar esta operación si así lo deseas.`}
                onCancel={() => {
                    setDisplayDeleteBatchAlert(false);
                }}
                onAction={() => {
                    onDelete(id);
                }}
                isPending={deleteBatchMutationIsPending}
                open={displayDeleteBatchAlert}
            />
            <div className="p-4 rounded-md bg-blackNormal max-w-40 min-w-40 min-h-48 max-h-48 flex flex-col gap-1">
                <div className="flex w-full items-center justify-end gap-2 min-h-8">
                    {
                        ownerId === session?.user.id &&
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className=" flex items-center justify-center">
                                    <KeyIcon className="h-4 w-4 text-greenMain" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className=" bg-blackMain border-none">
                                <p className="text-whiteMain">Esta tanda te pertenece</p>
                            </TooltipContent>
                        </Tooltip>
                    }
                    {/* {
                        ownerId === session?.user.id && status === "NOT_STARTED" &&
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
                            <DropdownMenuContent
                            >
                                <DropdownMenuItem
                                    onSelect={() => {
                                        setDisplayDeleteBatchAlert(true);
                                    }}
                                >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    } */}
                </div>
                <div className="flex flex-col gap-1 h-full">
                    <Link href={`/dashboard/batches/batch/${id}`} className="text-whiteMain font-bold text-sm underline flex max-w-max">
                        <TruncatedTooltip
                            tooltipContent={<p className="text-whiteMain font-normal" >{batchName}</p>}
                            text={batchName}
                        />
                    </Link>
                    <p className="text-grayMain text-xs truncate w-fit max-w-full">{seats} participantes</p>
                    <p className="text-grayMain text-xs truncate w-fit max-w-full">{contributionAmountFormatted} de contribución</p>
                </div>
                <div className="flex w-full items-center justify-between">
                    <span
                        className={cn(
                            "text-gray-500 text-xs font-bold",
                            {
                                "text-yellow-500 animate-pulse": status === "IN_PROGRESS",
                                "text-green-500": status === "FINISHED"
                            }
                        )}
                    >{TranslatedBatchStatus[status]}</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                className=" h-8 w-8 p-0 hover:bg-blackMain"
                                onClick={async () => {
                                    await handleCopyInviteLink({
                                        batchId: id
                                    });
                                }}
                                onMouseLeave={() => {
                                    if (inviteLinkCopied) {
                                        setTimeout(() => {
                                            setInviteLinkCopied(false);
                                        }, 1000);
                                    }
                                }}
                            >
                                {
                                    inviteLinkCopied ? <CheckIcon className="h-4 w-4 text-whiteMain" /> : <ShareIcon className="h-4 w-4 text-whiteMain" />
                                }
                            </Button>
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