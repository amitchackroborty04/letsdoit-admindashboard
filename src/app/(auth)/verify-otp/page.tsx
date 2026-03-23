import React, { Suspense } from 'react'
import VerifyEmailPage from './_components/VerifyEmailPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage/>
      </Suspense>
    </div>
  )
}

export default page
