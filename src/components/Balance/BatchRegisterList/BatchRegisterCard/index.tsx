
type BatchRegisterProps = {
  batchName: string
  amount: number
}

const BatchRegisterCard = ({ amount, batchName }: BatchRegisterProps) => {
  return (
    <div className="flex flex-col gap-1 bg-blackNormal h-fit w-[calc(95%/5)] min-w-[150px] rounded-md p-2 m-0">
      <div className="text-whiteMain font-black text-xl">{`${amount} MXN`}</div>
      <div className="text-whiteMain font-thin text-sm">{batchName}</div>
    </div>
  )
}

export default BatchRegisterCard