import HomeBanner from "./_Components/Home/HomeBanner";
import ServicesSection from "./_Components/Home/ServiceSection";

export default function Home() {
  return (
    <>
    {/* <SortMenu /> */}
    <div className='md:pt-14'>
    
      <HomeBanner />
      </div>
      <ServicesSection/>
      {/* <div className="md:mt-14">  <SubHeading heading={"DAILY AUCTIONS"} /></div>
      <DailyAuction/> */}
      {/* <div className="md:mt-24">  <SubHeading heading={"Need Help? Contact us"} /></div> */}
      {/* <ContactSection /> */}
      {/* <div className="md:mt-10">  <SubHeading heading={"Latest News"} /></div>
      <BlogSection /> */}
      {/* <Brand /> */}
    </>


  );
}
