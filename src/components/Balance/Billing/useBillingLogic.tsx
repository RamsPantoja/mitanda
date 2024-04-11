import { api } from "@/trpc/server"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const useBillingLogic = () => {
  const [flowData, setFlowData] = useState<object>()
  const [onboardingLink, setOnboardingLink] = useState<object>()
  const [dashboardLink, setOndashboardLink] = useState<object>()
  const [onboardingState, setOnboardingState] =  useState<boolean>(false)

  const {data: onboardingStateData, error: getOnboardingError, isLoading: loadingOnboardingState} =  api.stripe.stripeAccountByUserId.useQuery()

  useEffect(() => {
    if(onboardingStateData?.onboarding === true){
      setOnboardingState(true)
    }
  },[onboardingStateData])

  const { mutate: stripeFlowMutation, isPending: loadingStripeFlow } = api.stripe.stripeAccountFlow.useMutation({
    onSuccess: async (data) => {
      toast.success('succesfull mutation')
      setFlowData(data)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const { mutate: createOnboardingLink, isPending: linkIsPending } = api.stripe.newAccountLink.useMutation({
    onSuccess: async (data) => {
      toast.success('Link created successfull')
      setOnboardingLink(data)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })
  
  const { mutate: createStripeDashboardLink, isPending: dashboardLinkIsPending } = api.stripe.createStripeDashboardLink.useMutation({
    onSuccess: async (data) => {
      toast.success('Link created successfull')
      setOndashboardLink(data)
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  return {
    stripeFlowMutation,
    createOnboardingLink,
    flowData,
    onboardingLink,
    dashboardLink,
    createStripeDashboardLink,
    onboardingStateData,
    getOnboardingError,
    loadingOnboardingState,
    onboardingState,
  }
}

export default useBillingLogic