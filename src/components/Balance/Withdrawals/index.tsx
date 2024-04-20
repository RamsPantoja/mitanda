import WithdrawalCard from "./WithdrawalCard"
import WithdrawalCardSkeleton from "./WithdrawalCardSkeleton"
import useWithdrawalLOgic from "./useWithdrawalLogic"

const Withdrawals = () => {
  const {
    withdrawalData,
    withdrawalError,
    loadingWithdrawals,
    doWithdrawal
  } = useWithdrawalLOgic();

  return (
    <div className="flex flex-row flex-wrap w-full gap-4 content-start justify-start">
      {!withdrawalError && !loadingWithdrawals &&
        withdrawalData?.map((withdrawal, index) => {
          return (
            <WithdrawalCard
              key={index}
              onClick={doWithdrawal}
              withdrawalId={withdrawal.id}
              batchName={withdrawal.batch.name}//TODO check problem with return item from server, 
              amount={parseInt(withdrawal.contributionAmount)}
            />
          )
        })
      }
      {loadingWithdrawals && !withdrawalError &&
        <>
          <WithdrawalCardSkeleton />
          <WithdrawalCardSkeleton />
          <WithdrawalCardSkeleton />
          <WithdrawalCardSkeleton />
          <WithdrawalCardSkeleton />
        </>
      }
      {withdrawalError && !loadingWithdrawals &&
        <div>Internal Server Error</div>
      }
    </div>
  )
}

export default Withdrawals
