import Image from "next/image";
import mapImg from "../../Assets/map-img.png"

export default function ContactSection() {
  return (
    <div className="flex container mx-auto px-10 flex-col lg:flex-row items-center justify-center gap-10 p-10">
      {/* Left Side - Map */}
      <div className="relative w-full lg:w-1/2 flex justify-center">
        <Image
          src={mapImg}
          alt="USA Map"
          className="w-full max-w-md"
        />
      </div>

      {/* Right Side - Contact Form */}
      <div className="w-full lg:w-1/2 bg-white shadow-lg p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" className="p-2 border-b border-[#DDDDDD7D] " />
          <input type="text" placeholder="Last Name" className="p-2 border-b border-[#DDDDDD7D]  " />
          <input type="email" placeholder="Email Address" className="p-2 border-b  border-[#DDDDDD7D]  col-span-2" />
          <input type="text" placeholder="Subject" className="p-2 border-b border-[#DDDDDD7D]   col-span-2" />
        </div>
        <textarea
          placeholder="Your Message"
          className="p-2 border-b border-[#DDDDDD7D]  w-full mt-4 h-24"
        ></textarea>
        <button className="w-full mt-4 py-2 bg-[#F33E0A] text-white rounded-2xl hover:bg-[#d63006]">
          SEND MESSAGE
        </button>
      </div>
    </div>
  );
}
