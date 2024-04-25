'use client'
import FeedbackMessage from '@/components/common/FeedbackMessage'
import React from 'react'
import { useParams } from 'next/navigation'

// type Error {
//   usersLimit= 'MAX_USERS',
//   batchStarted = 'BATCH_ONPROGRESS'
// }

enum JoinErrorProps {
  limit = 'MAX_USERS',
  batchStarted = 'BATCH_ONPROGRESS'
}

export default function JoinToBatchError() {
  const joinToBatchError = useParams<{ error: JoinErrorProps }>()

  const message = joinToBatchError.error === JoinErrorProps.limit ? ' here La tanda a la que te intentas unir ya alcanzo el numero maximo de participantes'
    : joinToBatchError.error === JoinErrorProps.batchStarted ? ' La tanda ya ha sido iniciada, pausada o finalizada, no es posible unirte' : null

  return (
    <div className='flex flex-col gap-4 w-full h-svh bg-blackMain border-2 items-center p-4'>
      <FeedbackMessage
        message={message!}
        status='INFORMATION'
      />
    </div>
  )
}
