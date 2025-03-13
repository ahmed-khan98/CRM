import HomeBanner from "./_Components/Home/HomeBanner";
import SubHeading from "./_Components/SubHeading";
import AuctionCard from "./_Components/AuctionCard";
import ContactSection from "./_Components/Home/ContactSection";
import BlogSection from "./_Components/Home/Blog";
import Brand from "./_Components/Brand";

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
