
type WithdrawalProps = {
  batchName: string, 
  amount: number,
}

const WithdrawalCard = ({amount, batchName}: WithdrawalProps) => {
  return (
    <div className="flex flex-col gap-1 bg-blackNormal h-fit w-[calc(95%/3)] min-w-[150px] rounded-md p-2 m-0">
      <div className="text-whiteMain font-black text-xl">{`${amount} MXN`}</div>
      <div className="text-whiteMain font-thin text-sm">{batchName}</div>
      <button 
      className="inline-flex items-center justify-center whitespace-nowrap
                 text-sm font-medium ring-offset-background transition-colors
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                 h-9 rounded-md px-3 text-blackMain bg-greenMain hover:bg-greenMain">Obtener ingreso</button>
    </div>
  )
}

export default WithdrawalCard