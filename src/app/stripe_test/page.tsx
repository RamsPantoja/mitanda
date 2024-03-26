"use client"
import useStripeLogic  from './useStripeLogic'

const StripeTestPage = () => {
  const {
    onCreateStripeAccount,
  } = useStripeLogic()

  function create() {
    onCreateStripeAccount('rossnok')
  }

  return (
    <div>
      <button onClick={create} className='border-2 bg-green-500 px-4 rounded-full'>test</button>
    </div>
  )
}

export default StripeTestPage