import React from 'react'
import PaymentDetail from '@/app/_Components/Payment/PaymentDetail'

const page = ({params}) => {
  return (
   <PaymentDetail id={params.id}/>
  )
}

export default page
