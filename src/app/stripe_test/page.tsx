"use client"
import useStripeLogic  from './useStripeLogic'

const StripeTestPage = () => {
  const {
     onCreateStripeAccount,
     relationData
  } = useStripeLogic()

  function create() {
     onCreateStripeAccount('acct_1OykpFQkopk0C1Ac')
  }

  function showData() {
    console.log(relationData)
  }

  return (
    <div>
      <button onClick={showData} className='border-2 bg-green-500 px-4 rounded-full'>test</button>
    </div>
  )
}

export default StripeTestPage