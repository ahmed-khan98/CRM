import React from 'react'
import Faild from '../_Components/Payment/Faild'

export const metadata = {
  title: "Customer Payment Failed",
  // description: "Develop by ZYTRON WORLD",
  icons: {
    icon: '/payment-card.svg',
  },
};


const page = () => {
  return (
   <>
   <Faild/>
   </>
  )
}

export default page