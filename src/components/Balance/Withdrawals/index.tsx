import WithdrawalCard from "./WithdrawalCard"
import WithdrawalCardSkeleton from "./WithdrawalCardSkeleton"
import useWithdrawalLOgic from "./useWithdrawalLogic"

const Withdrawals = () => {
  const {
    withdrawalData,
    withdrawalError,
    loadingWithdrawals
  } = useWithdrawalLOgic();

  return (
    <div className="flex flex-row flex-wrap w-1/2 gap-4 content-start justify-start">
      {!withdrawalError && !loadingWithdrawals &&
        withdrawalData?.map((withdrawal, index) => {
          return (
            <WithdrawalCard
              key={index}
              batchName={withdrawal.batch.name}//TODO check problem with return item from server, 
              amount={parseInt(withdrawal.contributionAmount)}
            />
          )
        })
      }
      {loadingWithdrawals && !withdrawalError && true
        //TODO PUT ESKELETON
      }
      {
      <WithdrawalCardSkeleton/>
        //TODO PUT ERROR MESSAGE
      }
    </div>
  )
}

export default Withdrawals
