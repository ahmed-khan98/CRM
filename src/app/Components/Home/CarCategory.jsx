import Image from "next/image";
import CarImg1 from '../../Assets/carimg1.jpg'
import CarImg2 from '../../Assets/carimg2.jpg'

const categories = [
  {
    id: 1,
    title: "SPORT CARS",
    auctions: "20 Auctions",
    image: CarImg1
  },
  {
    id: 2,
    title: "VINTAGE CARS",
    auctions: "30 Auctions",
    image: CarImg2
  },
];

export default function CarCategories() {
  return (
    <div className="container mx-auto md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative rounded-lg overflow-hidden group"
          >
            {/* Background Image */}
            <div className="relative w-full h-64">
              <Image
                src={category.image}
                alt={category.title}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <p className="text-lg">{category.auctions}</p>
              <button className="mt-4 cursor-pointer border border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-black transition">
                VIEW MORE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
