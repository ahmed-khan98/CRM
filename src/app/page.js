import HomeBanner from "./_Components/Home/HomeBanner";
import SubHeading from "./_Components/Home/SubHeading";
import BlogSection from "./_Components/Home/Blog";
import Brand from "./_Components/Home/Brand";
import DailyAuction from "./_Components/Home/DailyAuction";
import ServicesSection from "./_Components/Home/ServiceSection";

export default function Home() {
  return (
    <>
      <HomeBanner />
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
