import React from 'react'

import HeadingDashboard from '../Components/Dashboard/HeadingDashboard'
import OfferBar from '../Components/Dashboard/OfferBar'
import LeftNav from '../Components/Vendors/LeftNav'

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

