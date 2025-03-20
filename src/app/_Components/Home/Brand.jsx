import React from 'react'
import SubHeading from './SubHeading'
import Image from 'next/image'
import BrandImg1 from '../../Assets/brandimg1.png'
import BrandImg2 from '../../Assets/brandimg2.png'


const Brand = () => {
  return (
    <>
<div className="bg-[#F9F9F9] py-16">
 <SubHeading heading={"Shop By Brand"} />


<div className="flex justify-center gap-16 mt-5 container mx-auto flex-wrap">
         
          <Image src={BrandImg1} alt="brand-img" />
          <Image src={BrandImg2} alt="brand-img" />
          <Image src={BrandImg1} alt="brand-img" />
          <Image src={BrandImg2} alt="brand-img" />
          <Image src={BrandImg1} alt="brand-img" />


</div>
    
    </div>    
    
    
    </>
  )
}

export default Brand