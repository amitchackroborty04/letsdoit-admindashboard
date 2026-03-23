import React, { Suspense } from 'react'
import ResetPasswordPage from './_components/ResetPasswordPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage/>
      </Suspense>
    </div>
  )
}

export default page
