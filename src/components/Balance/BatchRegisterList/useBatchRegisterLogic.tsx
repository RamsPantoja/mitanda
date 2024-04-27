import { api } from "@/trpc/server"

const useBatchRegisterLogic = () => {
  const { data: batchRegistersData, error: batchRegistersError, isLoading: batchRegistersIsLoading } = api.batchRegisters.searchEnableWithdrawals.useQuery()

  return {
    batchRegistersData,
    batchRegistersError,
    batchRegistersIsLoading,
  }
}

export default useBatchRegisterLogic;