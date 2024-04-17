import { api } from "@/trpc/server"

const useWithdrawalLOgic = () => {
  const {data: withdrawalData, error: withdrawalError, isLoading: loadingWithdrawals} =  api.batchRegisters.searchEnableWithdrawals.useQuery()

  
  return {
    withdrawalData,
    withdrawalError,
    loadingWithdrawals
  }
}

export default useWithdrawalLOgic