import { api } from "@/trpc/server"
import { toast } from "sonner"

const useBillingLogic = () => {

  const {mutate: accountLinkMutation, isPending: loadingAccountLink} = api.stripe.newAccountLink.useMutation({
    onSuccess: async () => {
      toast.success('link created')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const {mutate: stripeFlowMutation, isPending: loadingStripeFlow} =  api.stripe.createStripeAccount.useMutation({
    onSuccess: async () => {
      toast.success('succesfull mutation')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const generateStripeLink = (accountId: string) => {
    return accountLinkMutation({accountId})
  }

  const onCreateNewAccount = () => {
    stripeFlowMutation()
  }

  return  {
    onCreateNewAccount,
    generateStripeLink,
    loadingAccountLink
  }
}

export default useBillingLogic