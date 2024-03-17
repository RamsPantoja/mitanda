import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@nextui-org/slider";
import { Controller, type UseFormReturn } from "react-hook-form";
import { type BatchValidationSchema } from "./useBatchFormLogic";
import ErrorMessageInput from "@/components/common/ErrorMessageInput";
import { TranslatedFrequency } from "@/lib/enum";
import { useMemo } from "react";
import { numericFormatter } from 'react-number-format';

type BatchFormProps = {
    useFormBatch: UseFormReturn<BatchValidationSchema>
}

const BatchForm = ({ useFormBatch }: BatchFormProps) => {
    const { register, formState, control, watch } = useFormBatch;
    const watcher = watch();

    const contributionAmountFormatted = useMemo(() => {
        return numericFormatter(watcher.contributionAmount.toString(), {
            thousandSeparator: ','
        })
    }, [watcher.contributionAmount])

    return (
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
                            defaultValue={50}
                            className="max-w-md"
                            formatOptions={{ style: "currency", currency: "MXN" }}
                            onChangeEnd={(value) => {
                                field.onChange(value);
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
                            defaultValue={1}
                            className="max-w-md"
                            formatOptions={{ style: "currency", currency: "MXN" }}
                            getValue={(seats) => `${seats.toString()} de 10 Asientos`}
                            onChangeEnd={(value) => {
                                field.onChange(value);
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
                <p className="text-blackMain font-bold text-sm">Frecuencia</p>
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
                                    <Label htmlFor="r1">Semanal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="BIWEEKLY" id="r2" />
                                    <Label htmlFor="r2">Quincenal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="MONTHLY" id="r3" />
                                    <Label htmlFor="r3">Mensual</Label>
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
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <span className="text-xs text-blackMain font-bold">Cantidad y Frecuencia:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>La cantidad de la contribución será <b>${contributionAmountFormatted} MXN</b>.</li>
                        <li>Las contribuciones se realizarán <b>{TranslatedFrequency[watcher.frequency]}</b> apartir del inicio de la tanda.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Duración:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>La tanda durará segun el numero de participantes, hasta que todos hayan recibido su tanda.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Orden de Beneficiario:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>El orden de beneficiario se determinará mediante sorteo y se establecerá al principio de la tanda.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Método de Pago:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>Las contribuciones se realizarán a través de transferencia bancaria ó tarjeta de crédito/débito.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Registro:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>Un registro detallado de las contribuciones y los pagos se mantendrá y estará disponible para todos los participantes.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Consecuencias por Incumplimiento:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>En caso de que un participante no realice su contribución en la fecha acordada, [especificar las consecuencias, como una multa o la exclusión de futuras tandas].</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Finalización Anticipada:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>La tanda puede ser terminada anticipadamente por consentimiento mutuo de todos los participantes.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Disputas:</span>
                    <ul className="list-disc p-4 text-xs">
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
                            />
                        )}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Aceptar terminos y condiciones de la tanda
                    </label>
                </div>
                {
                    formState.errors.agreeTerms && <ErrorMessageInput status="ERROR" message={formState.errors.agreeTerms.message} />
                }
            </div>
        </div>
    )
}

export default BatchForm;