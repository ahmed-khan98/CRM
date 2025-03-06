import Image from "next/image";
import HomeBanner from "./Components/Home/HomeBanner";
import SubHeading from "./Components/SubHeading";
import AuctionCard from "./Components/AuctionCard";
import ContactSection from "./Components/Home/ContactSection";
import BlogSection from "./Components/Home/Blog";
import Brand from "./Components/Brand";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <SubHeading heading={"Latest Auctions"} />
      <AuctionCard />
      <div className="md:mt-24">  <SubHeading heading={"Need Help? Contact us"} /></div>
      <ContactSection />
      <div className="md:mt-10">  <SubHeading heading={"Latest News"} /></div>
      <BlogSection />
      <Brand />
    </>


  );
}
