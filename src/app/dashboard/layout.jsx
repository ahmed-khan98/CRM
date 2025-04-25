import React from 'react'
import LeftNav from '../_Components/Dashboard/LeftNav'
import HeadingDashboard from '../_Components/Dashboard/HeadingDashboard'
import OfferBar from '../_Components/Dashboard/OfferBar'

 const layout = ({children}) => {
  return (
      <>
      <OfferBar/>
      {/* <OfferBar/> */}
          <HeadingDashboard/>

        <div className="flex">
      <LeftNav /> 
        {children}
    </div>
      </>
  )
}


export default layout

