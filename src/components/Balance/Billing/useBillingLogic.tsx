import { api } from "@/trpc/server"
import { toast } from "sonner"

const useBillingLogic = () => {
  //TODO agregar un state para el manejo de los datos de las mutaciones o los errores

  const {mutate: stripeFlowMutation, isPending: loadingStripeFlow} =  api.stripe.stripeAccountFlow.useMutation({
    onSuccess: async (data) => {
      toast.success('succesfull mutation')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const {mutate: createOnboardingLink, isPending: linkIsPending} =  api.stripe.newAccountLink.useMutation({
    onSuccess: async () => {
      toast.success('Link created successfull')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  return  {
    stripeFlowMutation,
    createOnboardingLink
  }
}

export default useBillingLogic