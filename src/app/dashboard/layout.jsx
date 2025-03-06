import React from 'react'
import LeftNav from '../Components/Dashboard/LeftNav'
import HeadingDashboard from '../Components/Dashboard/HeadingDashboard'
import OfferBar from '../Components/Dashboard/OfferBar'

 const layout = ({children}) => {
  return (
      <>
      <OfferBar/>
          <HeadingDashboard/>

        <div className="flex  mt-5">
      <LeftNav /> 
        {children}
    </div>
      </>
  )
}


export default layout

