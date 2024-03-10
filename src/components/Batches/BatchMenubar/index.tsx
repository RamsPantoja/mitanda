"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import BatchForm from "../BatchForm";
import { api } from "@/trpc/react";
import { MitandaButton } from "@/components/common/MitandaButton";


const BatchMenubar = ({ }) => {
    const { mutate: createBatchMutation, isLoading } = api.batch.create.useMutation({
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        }
    })

    const onCreateBatch = () => {
        createBatchMutation({
            name: "Hola mundo"
        });
    }

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
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MitandaButton
                            size='sm'
                            variant='default'
                            startIcon={<PlusIcon className="h-4 w-4 text-blackMain" />}
                        >Crear</MitandaButton>
                    </DialogTrigger>
                    <DialogContent
                        onEscapeKeyDown={(e) => {
                            e.preventDefault();
                        }}
                        onCloseAutoFocus={(e) => {
                            e.preventDefault();
                        }}
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Tu nueva tanda</DialogTitle>
                            <DialogDescription>
                                Completa los campos para crear tu nueva tanda y comenzar a ahorrar!
                            </DialogDescription>
                        </DialogHeader>
                        <BatchForm />
                        <DialogFooter className="flex flex-row items-center justify-between gap-2">
                            <DialogClose asChild>
                                <Button disabled={isLoading} size='sm' type="button" variant="secondary">
                                    Descartar
                                </Button>
                            </DialogClose>
                            <MitandaButton onClick={onCreateBatch} size='sm' variant='default' isLoading={isLoading}>Crear tanda</MitandaButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

export default BatchMenubar;