import Image from "next/image";
import Link from "next/link";

const DailyAuction = () => {
  return (
    <div className="flex justify-center items-center  p-4">
      <div className="flex flex-col xl:grid xl:grid-cols-[40%_minmax(0,_1fr)] w-full max-w-4xl rounded-2xl bg-white shadow-lg overflow-hidden">
        
        {/* Image Section */}
        <div className="w-full h-60 xl:h-auto">
          <picture>
            <source
              srcSet="https://storage.googleapis.com/na-location-images-prd/dean-martin_900.avif 900w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_1750.avif 1750w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_3400.avif 3400w"
              sizes="100vw"
              type="image/avif"
            />
            <source
              srcSet="https://storage.googleapis.com/na-location-images-prd/dean-martin_900.webp 900w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_1750.webp 1750w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_3400.webp 3400w"
              sizes="100vw"
              type="image/webp"
            />
            <source
              srcSet="https://storage.googleapis.com/na-location-images-prd/dean-martin_900.jpg 900w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_1750.jpg 1750w, 
                      https://storage.googleapis.com/na-location-images-prd/dean-martin_3400.jpg 3400w"
              sizes="100vw"
              type="image/jpeg"
            />
            <img
              className="w-full h-full object-cover object-center"
              src="https://storage.googleapis.com/na-location-images-prd/dean-martin_3400.jpg"
              alt="Dean Martin location"
            />
          </picture>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between gap-6 text-left">
          {/* Title & Address */}
          <div className="bg-zinc-800">
            <p className="text-lg">Daily Auctions at</p>
            <h3 className="font-semibold text-2xl">Dean Martin</h3>
          </div>

          <div className="text-lg bg-zinc-800">
            <p>7440 Dean Martin Dr Suite 204</p>
            <p className="pbg-zinc-800">Las Vegas, NV</p>
            <p className="font-bold">9,095 items</p>
          </div>

          {/* Explore Button */}
          <Link
            className="block w-full md:w-fit text-lg font-semibold rounded-md py-3 px-6 bg-[#F33E0A]
               focus:outline-[3px] focus:outline-[#F397A2]
              disabled:from-gray-900 disabled:to-neutral-600 text-white text-center"
            href="/auction-product"
          >
            EXPLORE Dean Martin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyAuction;
