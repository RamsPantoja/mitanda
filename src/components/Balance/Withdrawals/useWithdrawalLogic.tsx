import { api } from "@/trpc/server"
import { toast } from "sonner"

const useWithdrawalLOgic = () => {
  const { data: withdrawalData, error: withdrawalError, isLoading: loadingWithdrawals } = api.batchRegisters.searchEnableWithdrawals.useQuery()

  const { mutate: doWithdrawalMutation, isPending: pendingWithdrawal } = api.batchRegisters.updateContributionAmount.useMutation({
    onSuccess: async (data) => {
      toast.success('success withdrawl')
      return console.log(data)
    },
    onError: (error) => {
      return console.log(error)
    }
  })

  const doWithdrawal = (id: string) => {
    doWithdrawalMutation({
      withdrawalId: id
    })
  }

  return {
    withdrawalData,
    withdrawalError,
    loadingWithdrawals,
    pendingWithdrawal,
    doWithdrawal
  }
}

export default useWithdrawalLOgic