// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaTiktok, FaSearch } from "react-icons/fa";
// import logo from '../../Assets/logo.png'
// import Image from "next/image";
// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="w-full bg-white ">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center flex-wrap py-3 px-16   bg-[#F33E0A] md:m-0 m-auto mx-auto">
//         <div className=" text-white md:m-0 m-auto text-center py-3 font-medium montserrat ">
//           Browse through our products library!
//         </div>

//         <div className="relative  md:w-[40%] w-full rounded-full bg-white ">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full px-4 py-2 rounded-lg text-gray-700 border-none outline-none"
//           />
//           <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-700 p-2 rounded-full">
//             <FaSearch />
//           </button>
//         </div>
//       </div>

//       {/* Middle Section */}
//       <div className="mx-auto  container py-8 px-10">
//         <div className="container grid grid-cols-1 md:grid-cols-5 gap-2 text-center md:text-left">

//           {/* Logo & Contact Info */}
//           <div>
//             <Image src={logo} alt="logo" className="md:m-0 m-auto" />
//             <a href="#" className="text-red-500 block mt-2">
//               [support@example.com]
//             </a>
//             <p className="text-gray-500 mt-1 montserrat">0-000-000-000</p>
//           </div>

//           {/* Footer Links */}
//           <div>
//             <h3 className="font-bold text-lg text-gray-700 montserrat">About Us</h3>
//             <ul className="mt-2 text-gray-500">
//               <li>
//                 <a href="#" className="hover:text-gray-700 montserrat">
//                   How To's
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-bold text-lg text-gray-700 montserrat">How To's</h3>
//             <ul className="mt-2 text-gray-500">
//               <li>
//                 <a href="#" className="hover:text-gray-700 montserrat">
//                   Terms
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-bold text-lg text-gray-700">FAQ's</h3>
//             <ul className="mt-2 text-gray-500">
//               <li>
//                 <a href="#" className="hover:text-gray-700">
//                   Policy
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Social Links */}
//           <div>
//             <h3 className="font-bold text-lg text-gray-700 montserrat">Follow Us</h3>
//             <div className="flex justify-center md:justify-start gap-3 mt-2">
//               <a href="#" className="text-[#F33E0A] ">
//                 <FaFacebookF />
//               </a>
//               <a href="#" className="text-[#F33E0A] ">
//                 <FaTwitter />
//               </a>
//               <a href="#" className="text-[#F33E0A] ">
//                 <FaLinkedinIn />
//               </a>
//               <a href="#" className="text-[#F33E0A] ">
//                 <FaInstagram />
//               </a>
//               <a href="#" className="text-[#F33E0A] ">
//                 <FaTiktok />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>



//       {/* Bottom Copyright */}
//       <div className="bg-gray-100 text-gray-600 text-center text-sm py-7 flex justify-center flex-wrap  gap-[50%]">
//         <p className="montserrat">Copyright by <Link href="https://hnhsofttechsolutions.com/">HNH Soft Tech Solutions</Link> . All Rights Reserved.</p>
//         {/* <p className="montserrat">HNH Soft Tech Solutions</p> */}
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { FaInstagram, FaFacebook, FaTimesCircle, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
   <>
    <footer className=" container mx-auto w-full py-4 border-t border-gray-300">
      {/* Top Links with Social Icons */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-800 px-6">
        <div className="space-x-2">
          <a href="#" className="hover:underline montserrat">About</a> |
          <a href="#" className="hover:underline montserrat"> FAQ’s</a> |
          <a href="#" className="hover:underline montserrat"> Contact Us</a> |
          <a href="#" className="text-red-600 font-bold hover:underline montserrat"> Resources</a> |
          <a href="#" className="text-green-600 font-bold hover:underline montserrat"> SELL YOUR STUFF</a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-3 text-xl">
          <a href="#" className="text-pink-500 hover:text-pink-600"><FaInstagram /></a>
          <a href="#" className="text-blue-600 hover:text-blue-700"><FaFacebook /></a>
          <a href="#" className="text-gray-500 hover:text-gray-600"><FaTimesCircle /></a>
          <a href="#" className="text-red-600 hover:text-red-700"><FaYoutube /></a>
          <a href="#" className="text-blue-500 hover:text-blue-600"><FaLinkedin /></a>
        </div>
      </div>

      {/* Google Adsense Placeholder */}
      <div className="bg-gray-300 cursor-pointer montserrat text-black text-xl font-bold py-6 px-4 my-4 mx-auto w-full text-center">
        Google Adsense/Monetize go here
      </div>

      {/* Terms & Copyright in One Line */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-700 mt-4 px-6">
        <div className="space-x-2">
          <a href="#" className="hover:underline montserrat">Terms & Conditions</a> |
          <a href="#" className="hover:underline montserrat"> Privacy Policy</a> |
          <a href="#" className="hover:underline montserrat"> Affiliate Policy</a>
        </div>

        <p className="montserrat text-sm">
          © Copyright 2025 <a href="#" className="text-blue-600 hover:underline">ArthurNicolas.com</a>
        </p>
      </div>
    </footer>
          {/* Bottom Red Bar */}
          <div className="bg-[#F33E0A] h-6 mt-4 w-full"></div>
   </>
  );
};

export default Footer;


