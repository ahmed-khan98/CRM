"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Main from "../../../app/Assets/Main.png";
import {
  filterBySearch,
  clearFilteredProducts,
} from "@/redux/filterSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get("token");
  const filteredProducts = useSelector((state) => state.filter.filteredProducts);
  console.log(filteredProducts,'filteredProducts')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  dispatch(filterBySearch(value));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("currentuser");
    router.push("/login");
  };

  const renderSearchBar = () => (
    <div className="relative w-[600px]">
      <div className="flex items-center bg-white border border-[#E9EFF4] rounded-full overflow-hidden">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          onClick={() => router.push("/auction-product")}
          className="cursor-pointer p-3 bg-gray-800 text-white rounded-r-full w-[100px] hover:bg-gray-900 "
        >
          Explore
        </button>
      </div>
  
      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-md  rounded-b-lg max-h-60 overflow-y-auto z-50">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              onClick={() => {
                setSearchTerm("");
                dispatch(clearFilteredProducts());
                router.push(`/detailproduct/${product._id}`);
              }}
              className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  const renderAuthButtons = () => (
    <>
      {!token && (
        <button
        onClick={() => router.push('/register')}
        className="cursor-pointer py-2.5 px-3 orange-bg text-white rounded-lg text-sm font-medium whitespace-nowrap shadow"
      >
        Register
      </button>
      )}
  <button
        onClick={() => (token ? handleLogout() : router.push('/login'))}
        className={`cursor-pointer py-2.5 px-3 rounded-lg text-white text-sm font-medium whitespace-nowrap shadow ${
          token ? 'orange-bg' : 'bg-[#2F318B]'
        }`}
      >
        {token ? 'Logout' : 'Log In'}
      </button>

      {token && (
        <button
          onClick={() => router.push('/dashboard/wishlist')}
          className="cursor-pointer py-2.5 px-3 orange-bg text-white rounded-lg text-sm font-medium whitespace-nowrap shadow"
        >
          Dashboard
        </button>
      )}

      <button
        onClick={() => router.push('/sell')}
        className="cursor-pointer py-2.5 px-3 bg-[#007E38] text-white rounded-lg text-sm font-medium whitespace-nowrap shadow"
      >
        Sell Your Stuff
      </button>
    </>
  );

  return (
    <>
      {/* Navbar */}
      <div className="bg-[#FFFFFF] border-b border-[#DDDDDD7D] fixed top-0 left-0 w-full z-50">
        <nav className="container mx-auto md:px-10 px-4 py-2 flex justify-between items-center">
          <Link href="/" className="w-45">
            <Image src={Main} alt="Logo" height={50} />
          </Link>

          <button
            className="lg:hidden p-2 text-[#F33E0A]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>

          <ul className="hidden lg:flex items-center space-x-6 !list-none">
            <li>{renderSearchBar()}</li>
          </ul>

          <div className="hidden lg:flex items-center space-x-4 text-black">
            {renderAuthButtons()}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <nav className="fixed top-0 left-0 h-full w-80 bg-white p-4 shadow-md">
          <div className="flex justify-between items-center mb-5">
            <Image src={Main} alt="Logo" width={120} height={50} />
            <button
              className="text-gray-500"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <div className="flex flex-col gap-3">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700"
                  onChange={(e) => dispatch(filterBySearch(e.target.value))}
                />
                <button className="p-3 bg-gray-800 text-white hover:bg-gray-900">
                  <FaSearch />
                </button>
              </div>
              <button
                onClick={() => dispatch(clearFilteredProducts())}
                className="py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 mt-6">{renderAuthButtons()}</div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
