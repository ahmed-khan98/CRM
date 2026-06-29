import CreateClientPaymentLink from '@/app/_Components/Payment/CreateClientPaymentLink'
import React from 'react'

const page = ({params}) => {
  return (
   <CreateClientPaymentLink id={params.id}/>
  )
}

export default page