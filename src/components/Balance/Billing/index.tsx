import { MitandaButton } from "@/components/common/MitandaButton";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

const Billing = () => {
    return (
        <div className='flex flex-col gap-2'>
            <p className="text-sm text-whiteMain font-bold">Información de facturación</p>
            <MitandaButton
                className=" w-fit"
                size='sm'
                variant='secondary'
                startIcon={<BuildingLibraryIcon className="h-4 w-4 text-blackMain" />}
            >Agregar información bancaria</MitandaButton>
        </div>
    )
}

export default Billing;