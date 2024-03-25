"use client"
import { api } from "@/trpc/react"
import { toast } from "sonner"

const useStripeLogic = () => {

  const { mutate: stripeMutation, isLoading: stripeLoading } = api.batch.stripeTest.useMutation({
    onSuccess: async () => {
      toast.success('mutation succeful')
    },
    onError: (error) => {
      console.log(error.message)
    }
  })

  const onCreateStripeAccount = (name: string) => {
    stripeMutation({
      name: name
    })
  }

  return {
    onCreateStripeAccount,
  }
}

export default useStripeLogic