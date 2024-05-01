import { useState } from "react"
import { api } from "@/trpc/server"

const useCurrentBalanceLogic = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const { data: batchRegistersData, error: batchRegistersError, isLoading: batchRegistersIsLoading } = api.batchRegisters.searchEnableWithdrawals.useQuery()

  function sumAmounts(batchRegisterData: []) {
    let sum = 0
    if (batchRegisterData) {
      batchRegistersData!.map(item => {
        sum += parseInt(item.contributionAmount)
      })
    }
    setTotalAmount(sum)
  }

  return {
    totalAmount,
    sumAmounts,
    batchRegistersData,
    batchRegistersIsLoading
  }
}

export default useCurrentBalanceLogic