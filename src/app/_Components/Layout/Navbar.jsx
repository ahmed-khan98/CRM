"use client";
import React, { useState } from "react";
// import { FaBagShopping, FaSearch } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { CiHeart } from "react-icons/ci";
import Image from "next/image";
import logo from "../../../app/Assets/logo.png";
import NavbarCat from "../NavbarCategorys";
import { FaSearch } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import Link from "next/link";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userCookie = Cookies.get("currentuser");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const role = user?.role;

  return (
    <>
      {/* Top Bar */}
      <div className="hidden bg-[#FFFFFF] lg:block border-b border-[#DDDDDD7D]">
        <div className="container flex justify-between mx-auto px-10">
          <div className="flex gap-3 py-3 text-[#334141]">
            <p className="text-[#334141]">EN</p>
            <p>Call us toll free: 0-000-000-000</p>
            <p>Send us an email: support@example.com</p>
          </div>
          <div className="py-3 text-black flex items-center gap-2">
            <CiHeart className="mt-1" /> Wishlist
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-[#FFFFFF]">
        <nav className="container  mx-auto md:px-10 px-4 py-2 flex justify-between items-center">

          <Link href="/home1" className="w-32">
            <Image src={logo} alt="Logo" width={120} height={50} />
          </Link>


          <button
            className="lg:hidden p-2 text-[#F33E0A] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>


          <ul className="hidden lg:flex items-center space-x-6">
            <li>
              <div className="flex items-center bg-white border border-[#E9EFF4] rounded-full overflow-hidden">

                <select className="px-4 py-2 bg-white border-r border-[#DDDDDD] text-gray-700 outline-none">
                  <option>Category</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Living</option>
                </select>

                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700"
                />

                <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900">
                  <FaSearch />
                </button>
              </div>
            </li>
          </ul>


          <div className="hidden text-black lg:flex items-center space-x-4">

            <div className="flex flex-col items-center">
              <button className=" flex items-center gap-2">
                My Cart <FaBagShopping className="text-[#F33E0A]" />
              </button>
              <span className="text-sm">0 items - $0.00</span>
            </div>

            {
              role === "USER" ? null :
                <Link
                  className="py-2.5 px-4 flex items-center gap-2 bg-[#F33E0A] text-white "
                  href="/vendors/addproducts"
                >
                  Sell Your Stuff <ImHammer2 className="transform rotate-80" />
                </Link>
            }
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden`}
      >
        <nav className="fixed top-0 left-0 h-full w-80 bg-white p-2 shadow-md">
          <div className="flex justify-between items-center mb-5">
            <Image src={logo} alt="Logo" width={120} height={50} />
            <button
              className="text-gray-500"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-4 w-full">
            {/* Category Dropdown */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full">
              <select className=" py-2 w-full text-gray-700 outline-none bg-white">
                <option>Category</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center border mt-2 border-gray-300 rounded-lg overflow-hidden w-full">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1  py-2 outline-none bg-white text-gray-700"
              />
              <button className="  text-black ">
                <FaSearch className="w-4 h-5" />
              </button>
            </div>
          </div>




          {/* Cart & Sell Buttons */}
          <div className="mt-6">
            <div className="flex flex-col items-center text-center">
              <button className="px-4 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  My Cart <FaBagShopping className="text-[#F33E0A]" />
                </div>
                <span className="text-sm">0 items - $0.00</span>
              </button>
            </div>

            <a
              href="#"
              className="flex items-center justify-center gap-2 py-2 mt-3 bg-[#F33E0A] text-white rounded-md"
            >
              Sell Your Stuff <ImHammer2 className="transform rotate-80" />
            </a>


          </div>
        </nav>
      </div>

      {/* Navbar Categories */}
      <NavbarCat />
    </>
  );
};

export default Navbar;
