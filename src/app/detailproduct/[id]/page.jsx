import React from 'react'
import ProductDetail from '@/app/_Components/ProductDetail/ProductDetail'

const page = ({params}) => {
  
  return (
   <>
   <ProductDetail  id={params.id}/>
   </>
  )
}

export default page
