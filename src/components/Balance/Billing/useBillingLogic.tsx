import { api } from "@/trpc/server"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { accounts } from '../../../server/db/schema';

const useBillingLogic = () => {
  const [flowData, setFlowData] = useState<object>() 
  const [dashboardLink, setOndashboardLink] = useState<string>()
  const [onboardingState, setOnboardingState] = useState<boolean>(false)
  const router = useRouter()

  const { data: onboardingStateData, error: getOnboardingError, isLoading: loadingOnboardingState } = api.stripe.stripeAccountByUserId.useQuery()

  useEffect(() => {
    if (onboardingStateData?.onboarding === true) {
      setOnboardingState(true)
    }
  }, [onboardingStateData])

  const { mutate: stripeFlowMutation, isPending: loadingStripeFlow } = api.stripe.stripeAccountFlow.useMutation({
    onSuccess: async (data) => {
      setFlowData(data)
      return router.push(data.generateOnboardingLink.url)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const { mutate: createStripeDashboardLink, isPending: dashboardLinkIsPending } = api.stripe.createStripeDashboardLink.useMutation({
    onSuccess: async (data) => {
      setOndashboardLink(data.url)
      return router.push(data.url)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  return {
    stripeFlowMutation,
    flowData,
    dashboardLink,
    createStripeDashboardLink,
    onboardingStateData,
    getOnboardingError,
    loadingOnboardingState,
    onboardingState,
  }
}

export default useBillingLogic