import ProductDetail from '@/app/_Components/ProductDetail/productDetail'
import React from 'react'

const page = ({params}) => {
  
  return (
   <>
   <ProductDetail  id={params.id}/>
   </>
  )
}

export default page
