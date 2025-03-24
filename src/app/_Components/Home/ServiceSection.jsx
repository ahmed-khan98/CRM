import Link from "next/link";

const ServicesSection = () => {
  return (
    <div className="text-center py-10 px-4 md:px-10">
      {/* Heading */}
      <h2 className="text-3xl md:text-5xl font-bold text-[#F33E0A] montserrat">
        Services We Offer
      </h2>

      {/* Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
        
        {/* Auctions */}
        <div className="relative bg-white p-6 pt-14 rounded-lg shadow-lg">
          <h3 className="absolute montserrat top-[-18px] left-1/2 -translate-x-1/2 bg-white text-red-800 font-bold text-lg py-2 px-4 ">
            AUCTIONS
          </h3>
          <p className="text-gray-700 mt-4 text-sm">
            Save up to 90% at our online auctions, featuring high-quality equipment for small businesses, retail arbitrage, online reselling, and home improvement projects. Explore our curated inventory today and seize exceptional value for your success!
          </p>
        </div>

        {/* Consignments */}
        <div className="relative bg-white p-6 pt-14 rounded-lg shadow-lg">
          <h3 className="absolute montserrat top-[-18px] left-1/2 -translate-x-1/2 bg-white text-blue-400 font-bold text-lg py-2 px-4 ">
            CONSIGNMENTS
          </h3>
          <p className="text-gray-700 mt-4 text-sm">
            Turn your unwanted items into cash! Whether you have a few items to sell, are moving, or just want to declutter, our service is perfect for you. Consign with us and watch your items sell at our weekly auctions!
          </p>
        </div>

        {/* Liquidations */}
        <div className="relative bg-white p-6 pt-14 rounded-lg shadow-lg">
          <h3 className="absolute montserrat top-[-18px] left-1/2 -translate-x-1/2 bg-white text-green-400 font-bold text-lg py-2 px-4 ">
            LIQUIDATIONS
          </h3>
          <p className="text-gray-700 mt-4 text-sm">
            Is your business closing its doors or already shut down? Don’t let unused equipment and inventory go to waste! Let us help you turn those assets into cash. Whether your business is big or small, we can assist you. Contact us today!
          </p>
        </div>
      </div>

      {/* Browse Auction Button */}
      <div className="mt-12">
        <Link href="/auction-product">
          <button className="bg-[#F33E0A] cursor-pointer text-white text-lg font-bold py-3 px-6 rounded-full transition-all hover:bg-red-700">
            BROWSE AUCTION
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesSection;
