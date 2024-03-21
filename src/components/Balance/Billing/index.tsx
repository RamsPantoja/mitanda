import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Billing = () => {
    return (
        <div className='flex flex-col gap-2'>
            <p className="text-sm text-whiteMain font-bold">Información de facturación</p>
            <Button size='sm' variant='outline' className="w-fit bg">Agregar</Button>
            <Card className="w-fit">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2 flex-wrap">
                            <span className="text-grayMain text-xs basis-32">Destinatario</span>
                            <span className="text-whiteMain text-sm font-medium">Test ting</span>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap">
                            <span className="text-grayMain text-xs basis-32">Banco</span>
                            <span className="text-whiteMain text-sm font-medium">BBVA BANCOMER, S.A.</span>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap">
                            <span className="text-grayMain text-xs basis-32">Número de cuenta (CLABE)</span>
                            <span className="text-whiteMain text-sm font-medium">012424340293719111</span>
                        </div>
                        <div className="flex flex-row gap-2 flex-wrap">
                            <span className="text-grayMain text-xs basis-32">Dirección del destinatario</span>
                            <div className="flex flex-col">
                                <span className="text-whiteMain text-sm font-medium">Jo2sase Mar221ndaia #111, Savcn Juazmn</span>
                                <span className="text-whiteMain text-sm font-medium">Morelia, Michoacán 8052060</span>
                                <span className="text-whiteMain text-sm font-medium">México</span>
                                <span className="text-whiteMain text-sm font-medium">443231322</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Billing;