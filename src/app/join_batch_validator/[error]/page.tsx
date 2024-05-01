'use client'
import FeedbackMessage from '@/components/common/FeedbackMessage'
import React from 'react'
import { useParams } from 'next/navigation'
import { MitandaButton } from '@/components/common/MitandaButton'
import { useRouter } from 'next/navigation'

enum JoinErrorProps {
  limit = 'MAX_USERS',
  batchStarted = 'BATCH_ONPROGRESS'
}

export default function JoinToBatchError() {
  const router = useRouter()

  const onRedirect = () => {
    return router.push('/dashboard')
  }

  const joinToBatchError = useParams<{ error: JoinErrorProps }>()

  const message = joinToBatchError.error === JoinErrorProps.limit ? 'La tanda que deseas unirte está llena.'
    : joinToBatchError.error === JoinErrorProps.batchStarted ? 'La tanda ya ha sido iniciada, pausada o finalizada, no es posible unirte' : null

  return (
    <div className='flex flex-col gap-4 w-full h-svh bg-blackMain justify-center items-center p-4'>
      <div>
        <FeedbackMessage
          message={message!}
          status='INFORMATION'
        />
      </div>
      <MitandaButton
        onClick={onRedirect}>
        Ir a inicio
      </MitandaButton>
    </div>
  )
}
