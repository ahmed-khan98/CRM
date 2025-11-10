import React from 'react'
import LeadDetail from '../../../../_Components/leadDetail/LeadDetail'

const page = ({params}) => {
  return (
   <LeadDetail id={params.id}/>
  )
}

export default page
