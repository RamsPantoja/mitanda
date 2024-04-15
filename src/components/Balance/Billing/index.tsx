import { MitandaButton } from "@/components/common/MitandaButton";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import UseBillingLogic from "./useBillingLogic";
import BillingInformationSkeleton from "./BillingSkeleton/billingInformationSkeleton";

const Billing = () => {
    const {
        stripeFlowMutation,
        createStripeDashboardLink,
        onboardingStateData,
        getOnboardingError,
        loadingOnboardingState,
        onboardingState
    } = UseBillingLogic()

    return (
        <div className='flex flex-col gap-2'>
            {!loadingOnboardingState && !getOnboardingError &&
                <>
                    <p className="text-sm text-whiteMain font-bold">Información de facturación</p>
                    <MitandaButton
                        className=" w-fit"
                        size='sm'
                        variant='secondary'
                        onClick={onboardingState ? () => { createStripeDashboardLink() } : () => { stripeFlowMutation() }}
                        startIcon={<BuildingLibraryIcon className="h-4 w-4 text-whiteMain" />}
                    >{onboardingState ? 'Ir a dashboard' : 'Agregar datos bancarios'}</MitandaButton>
                </>
            }
            {loadingOnboardingState && !getOnboardingError &&
                <BillingInformationSkeleton />
            }
            { getOnboardingError && !loadingOnboardingState &&
                <div className="text-red-500">Internal server error</div>
            }
        </div>
    )
}

export default Billing;