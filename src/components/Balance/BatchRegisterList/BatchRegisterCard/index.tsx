import { DateTime } from "luxon"

type BatchRegisterProps = {
  batchName: string
  amount: number,
  startDate: Date,
  endDate: Date
}

const BatchRegisterCard = ({ amount, batchName, startDate, endDate }: BatchRegisterProps) => {
  return (
    <div className="flex flex-col gap-1 bg-blackMain border-greenMain h-fit w-[calc(95%/5)] min-w-[150px] rounded-md p-4 m-0">
      <div className="text-whiteMain font-black text-xl">{`${amount} MXN`}</div>
      <div className="text-whiteMain font-thin text-base">{batchName}</div>
      <div className="flex justify-end text-whiteMain font-thin text-[12px]">{ `${DateTime.fromJSDate(startDate).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(endDate).toLocaleString(DateTime.DATE_MED)}` }</div>
    </div>
  )
}

export default BatchRegisterCard