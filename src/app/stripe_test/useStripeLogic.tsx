"use client"
import { api } from "@/trpc/react"
import { toast } from "sonner"

const useStripeLogic = () => {

  const { mutate: stripeMutation, isPending: stripeIsLoading } = api.batch.stripeTest.useMutation({
    onSuccess: async () => {
      toast.success('mutation succeful')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const onCreateStripeAccount = (name: string) => {
    stripeMutation({ name })
  }

  return {
    onCreateStripeAccount, //TODO preguntar sobre el error del any que lanza ts
  }
}

export default useStripeLogic