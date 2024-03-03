import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area"

const BatchForm = () => {
    return (
        <div className="flex flex-col gap-3">
            <Input type="email" placeholder="Nombre de la tanda" />
            <Input type="email" placeholder="Cantidad de contribución (MXN)" />
            <Input type="email" placeholder="Asientos (máximo 10)" />
            <div className="flex flex-col gap-2">
                <p className="text-blackMain font-bold text-sm">Frecuencia</p>
                <RadioGroup defaultValue="comfortable" className="flex flex-row">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="r1" />
                        <Label htmlFor="r1">Semanal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comfortable" id="r2" />
                        <Label htmlFor="r2">Quincenal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compact" id="r3" />
                        <Label htmlFor="r3">Mensual</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="flex flex-col gap-2 mt-4 w-full">
                <p className="text-blackMain text-sm font-bold">Contrato</p>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <span className="text-xs text-blackMain font-bold">Cantidad y Frecuencia:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>La cantidad de la contribución será ${1000} MXN.</li>
                        <li>Las contribuciones se realizarán semanalmente apartir del inicio de la tanda.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Duración:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>La tanda durará segun el numero de participantes, hasta que todos hayan recibido su tanda.</li>
                    </ul>

                    <span className="text-xs text-blackMain font-bold">Orden de Pago:</span>
                    <ul className="list-disc p-4 text-xs">
                        <li>El orden de pago se determinará mediante sorteo y se establecerá al principio de la tanda.</li>
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
                    <Checkbox id="terms" />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Aceptar terminos y condiciones de la tanda
                    </label>
                </div>
            </div>
        </div>
    )
}

export default BatchForm;