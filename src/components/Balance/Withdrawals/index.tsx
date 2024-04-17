import WithdrawalCard from "./WithdrawalCard"
import useWithdrawalLOgic from "./useWithdrawalLogic"

const Withdrawals = () => {
  const {
    withdrawalData
  } =  useWithdrawalLOgic()

  console.log(withdrawalData)
  return (
    <div className="flex flex-row flex-wrap w-1/2 gap-4 content-start justify-start">
      <WithdrawalCard
        amount={5000}
        batchName="Tanda los panas"
      />
      <WithdrawalCard
        amount={5000}
        batchName="Tanda los panas"
      />
      <WithdrawalCard
        amount={5000}
        batchName="Tanda los panas"
      />
    </div>
  )
}

export default Withdrawals
