import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@nextui-org/slider";
import { Controller } from "react-hook-form";
import useBatchFormLogic from "./useBatchFormLogic";
import ErrorMessageInput from "@/components/common/ErrorMessageInput";
import { TranslatedFrequency } from "@/lib/enum";
import { useMemo } from "react";
import { numericFormatter } from 'react-number-format';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MitandaButton } from "@/components/common/MitandaButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const BatchForm = () => {
    const {
        useFormBatch,
        createBatchMutationIsPending,
        onCreateBatch,
        displayBatchForm,
        setDisplayBatchForm
    } = useBatchFormLogic();
    const { register, formState, control, watch, reset } = useFormBatch;
    const watcher = watch();

    const contributionAmountFormatted = useMemo(() => {
        return numericFormatter(watcher.contributionAmount.toString(), {
            thousandSeparator: ','
        })
    }, [watcher.contributionAmount])

    return (
        <Dialog
            open={displayBatchForm}
            onOpenChange={setDisplayBatchForm}
        >
            <DialogTrigger asChild>
                <MitandaButton
                    variant='default'
                    startIcon={<PlusCircleIcon className="h-5 w-5 text-blackMain" />}
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
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Input
                            placeholder="Nombre de la tanda"
                            {...register('name')}
                            status={formState.errors.name && "ERROR"}
                        />
                        {
                            formState.errors.name && <ErrorMessageInput status="ERROR" message={formState.errors.name.message} />
                        }
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name='contributionAmount'
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    size='md'
                                    step={100}
                                    color="primary"
                                    label="Cantidad de contribución"
                                    showSteps={true}
                                    maxValue={1000}
                                    minValue={100}
                                    radius='full'
                                    defaultValue={field.value}
                                    className="max-w-md"
                                    formatOptions={{ style: "currency", currency: "MXN" }}
                                    onChangeEnd={(value) => {
                                        field.onChange(value);
                                    }}
                                    classNames={{
                                        track: "border-s-whiteMain",
                                        filler: "bg-gradient-to-r from-whiteMain to-whiteMain",
                                        label: "text-whiteMain",
                                        value: "text-whiteMain",
                                        step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                                        thumb: [
                                            "transition-size",
                                            "bg-gradient-to-r from-blackMain to-blackMain",
                                            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                                            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6"
                                        ],
                                    }}
                                    ref={field.ref}
                                />
                            )}
                        />
                        {
                            formState.errors.contributionAmount && <ErrorMessageInput status="ERROR" message={formState.errors.contributionAmount.message} />
                        }
                    </div>
                    <div className="flex flex-col gap-1">
                        <Controller
                            name="seats"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    size='md'
                                    step={1}
                                    color="primary"
                                    label="Asientos"
                                    showSteps={true}
                                    maxValue={10}
                                    minValue={1}
                                    radius='full'
                                    defaultValue={field.value}
                                    className="max-w-md"
                                    formatOptions={{ style: "currency", currency: "MXN" }}
                                    getValue={(seats) => `${seats.toString()} de 10 Asientos`}
                                    onChangeEnd={(value) => {
                                        field.onChange(value);
                                    }}
                                    classNames={{
                                        track: "border-s-whiteMain",
                                        filler: "bg-gradient-to-r from-whiteMain to-whiteMain",
                                        label: "text-whiteMain",
                                        value: "text-whiteMain",
                                        step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                                        thumb: [
                                            "transition-size",
                                            "bg-gradient-to-r from-blackMain to-blackMain",
                                            "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
                                            "data-[dragging=true]:w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6"
                                        ],
                                    }}
                                    ref={field.ref}
                                />
                            )}
                        />
                        {
                            formState.errors.seats && <ErrorMessageInput status="ERROR" message={formState.errors.seats.message} />
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-sm text-whiteMain">Frecuencia</p>
                        <div className="flex flex-col gap-1">
                            <Controller
                                name="frequency"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        defaultValue="WEEKLY"
                                        className="flex flex-row"
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="WEEKLY" id="r1" />
                                            <Label className="text-whiteMain" htmlFor="r1">Semanal</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="BIWEEKLY" id="r2" />
                                            <Label className="text-whiteMain" htmlFor="r2">Quincenal</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="MONTHLY" id="r3" />
                                            <Label className="text-whiteMain" htmlFor="r3">Mensual</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {
                                formState.errors.frequency && <ErrorMessageInput status="ERROR" message={formState.errors.frequency.message} />
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4 w-full">
                        <ScrollArea className="h-[300px] w-full rounded-md border border-blackMain p-4 bg-grayStrong">
                            <span className="text-xs text-whiteMain font-bold">Cantidad y Frecuencia:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>La cantidad de la contribución será <b>${contributionAmountFormatted} MXN</b>.</li>
                                <li>Las contribuciones se realizarán <b>{TranslatedFrequency[watcher.frequency]}</b> apartir del inicio de la tanda.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Duración:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>La tanda durará segun el numero de participantes, hasta que todos hayan recibido su tanda.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Orden de Beneficiario:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>El orden de beneficiario se determinará mediante sorteo y se establecerá al principio de la tanda.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Método de Pago:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>Las contribuciones se realizarán a través de transferencia bancaria ó tarjeta de crédito/débito.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Registro:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>Un registro detallado de las contribuciones y los pagos se mantendrá y estará disponible para todos los participantes.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Consecuencias por Incumplimiento:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>En caso de que un participante no realice su contribución en la fecha acordada, [especificar las consecuencias, como una multa o la exclusión de futuras tandas].</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Finalización Anticipada:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>La tanda puede ser terminada anticipadamente por consentimiento mutuo de todos los participantes.</li>
                            </ul>

                            <span className="text-xs text-whiteMain font-bold">Disputas:</span>
                            <ul className="list-disc p-4 text-xs text-whiteMain">
                                <li>Las disputas serán resueltas a través de [mediación/arbitraje/tribunal, según sea necesario]</li>
                            </ul>
                        </ScrollArea>
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="agreeTerms"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="terms"
                                        ref={field.ref}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                        }}
                                        defaultChecked={field.value}
                                    />
                                )}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-whiteMain"
                            >
                                Aceptar terminos y condiciones de la tanda
                            </label>
                        </div>
                        {
                            formState.errors.agreeTerms && <ErrorMessageInput status="ERROR" message={formState.errors.agreeTerms.message} />
                        }
                    </div>
                </div>
                <DialogFooter className="flex flex-row items-center justify-between gap-2">
                    <DialogClose asChild>
                        <MitandaButton onClick={() => reset()} disabled={createBatchMutationIsPending} size='sm' type="button" variant="secondary">
                            Descartar
                        </MitandaButton>
                    </DialogClose>
                    <MitandaButton onClick={useFormBatch.handleSubmit(onCreateBatch)} size='sm' variant='default' isPending={createBatchMutationIsPending}>Crear tanda</MitandaButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BatchForm;