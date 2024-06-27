import { useToast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

function VerifyAccount() {
    const router = useRouter()
    const parm = useParams<{username: string}>()
    const {toast} = useToast()

    
  return (
    <div>VerifyAccount</div>
  )
}

export default VerifyAccount