import React from 'react'

import HeadingDashboard from '../_Components/Dashboard/HeadingDashboard'
import OfferBar from '../_Components/Dashboard/OfferBar'
import LeftNav from '../_Components/Vendors/LeftNav'

 const layout = ({children}) => {
  return (
      <>
     
          <HeadingDashboard/>

        <div className="flex   my-16 container mx-auto">
      <LeftNav /> 
        {children}
    </div>
      </>
  )
}


export default layout

