"use client"
import { api } from "@/trpc/react"
import { toast } from "sonner"

const useStripeLogic = () => {

   const { mutate: stripeMutation, isPending: stripeIsLoading } = api.stripe.create.useMutation({
    onSuccess: async () => {
      toast.success('mutation succeful')
    },
    onError: (error) => {
      console.log(error.message)
    }
  });

  const {data: relationData, isLoading: relationLoading} = api.stripe.find.useQuery()

  const onCreateStripeAccount = (accountId: string) => {
    stripeMutation({ accountId })
  }

  return {
     onCreateStripeAccount,
     stripeIsLoading,
     relationData
  }
}

export default useStripeLogic

