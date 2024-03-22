import { Input } from "@/components/ui/input"
import useBillingFormLogic from "./useBillingFormLogic";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MitandaButton } from "@/components/common/MitandaButton";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const BillingForm = ({ }) => {
    const {
        onCreateBilling,
        useBillingForm,
        displayBillingForm,
        setDisplayBillingForm
    } = useBillingFormLogic();

    const { register, formState, handleSubmit, reset } = useBillingForm

    return (
        <Dialog
            open={displayBillingForm}
            onOpenChange={setDisplayBillingForm}
        >
            <DialogTrigger asChild>
                <MitandaButton
                    size='sm'
                    variant='default'
                    startIcon={<PlusIcon className="h-4 w-4 text-blackMain" />}
                >Agregar</MitandaButton>
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
                <div className="flex flex-col gap-3">
                    <Input
                        placeholder="Nombre"
                        {...register("firstName")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="Apellidos"
                        {...register("lastName")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="Dirección"
                        {...register("address")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="Ciudad"
                        {...register("city")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="Estado"
                        {...register("state")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="Código postal"
                        {...register("postalCode")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                    <Input
                        placeholder="CLABE"
                        {...register("clabe")}
                        status={formState.errors.firstName && "ERROR"}
                    />
                </div>
                <DialogFooter className="flex flex-row items-center justify-between gap-2">
                    <DialogClose asChild>
                        <Button onClick={() => reset()} disabled={false} size='sm' type="button" variant="secondary">
                            Descartar
                        </Button>
                    </DialogClose>
                    <MitandaButton onClick={handleSubmit(onCreateBilling)} size='sm' variant='default' isLoading={false}>Guardar</MitandaButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BillingForm;