"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../app/Assets/logo.png";
import { FaHeart, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useGetallsubCategoriesQuery, useGetCategoriesQuery } from "@/app/_Services/categories/page";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { clearFilteredProducts, filterByCategory, filterBySearch, filterBySubCategory } from "@/redux/filterSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  // const userCookie = Cookies.get("currentuser");
  // const user = userCookie ? JSON.parse(userCookie) : null;
  // const role = user?.role;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categories, isLoading, error } = useGetCategoriesQuery()
  const { data: subcategories, isLoading: loading, error: erros } = useGetallsubCategoriesQuery()

  return (
    <>
      {/* Top Bar */}
      {/* <div className="hidden bg-[#FFFFFF] lg:block border-b border-[#DDDDDD7D]">
        <div className="container flex justify-between mx-auto px-10">
          <div className="flex gap-3 py-3 text-[#334141]">
            <p className="text-[#334141]">EN</p>
            <p>Call us toll free: 0-000-000-000</p>
            <p>Send us an email: support@example.com</p>
          </div>
          <Link href={"/dashboard/wishlist"}>
            <div className="py-3 text-black flex items-center gap-2">
              <FaHeart className="text-red-600" /> Wishlist
            </div>
          </Link>
        </div>
      </div> */}

      {/* Navbar */}
      <div className="bg-[#FFFFFF] border-b border-[#DDDDDD7D]">
        <nav className="container  mx-auto md:px-10 px-4 py-2 flex justify-between items-center">

          <Link href="/" className="w-32">
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
              <div className="flex w-[600px] items-center bg-white border border-[#E9EFF4] rounded-full overflow-hidden">
                {/* <select
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected Category ID:", selectedValue);
                    if (selectedValue === "") {
                      dispatch(clearFilteredProducts());
                    } else {
                      dispatch(filterByCategory(selectedValue));
                    }
                  }}
                  className="px-4 py-2 bg-white border-r border-[#DDDDDD] text-gray-700 outline-none">
                  <option value="">Categories</option>

                  {categories?.data?.map((category) => (
                    <option value={category?._id} key={category?._id}>
                      {category.name}
                    </option>
                  ))}
                </select> */}



                {/* <div className="flex items-center  rounded-lg px-2  overflow-hidden w-full">
                  <select onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Selected Category ID:", selectedValue);
                    if (selectedValue === "") {
                      dispatch(clearFilteredProducts());
                    } else {
                      dispatch(filterBySubCategory(selectedValue));
                    }
                  }} className=" py-2 w-full text-gray-700 outline-none bg-white">
                    <option value="">Sub Categories</option>
                    {subcategories?.data?.map((category) => (
                      <option value={category?._id} key={category?._id} >
                        {category.name}
                      </option>
                    ))}
                  </select>

                </div> */}

                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700"
                  onChange={(e) => dispatch(filterBySearch(e.target.value))}
                />

                <button className="p-3 bg-gray-800 text-white rounded-r-full w-[100px]  hover:bg-gray-900">
                  {/* <FaSearch /> */}
                  Explore
                </button>

                {/* <button onClick={() => dispatch(clearFilteredProducts())} className="py-2 px-2 pl-2 bg-gray-800 text-white w-[100px] rounded-r-full  mx-1 hover:bg-gray-900">
                  Clear
                </button> */}
              </div>
            </li>
          </ul>


          <div className="hidden text-black lg:flex items-center space-x-4">

            {/* <div className="flex flex-col items-center">
              <button className=" flex items-center gap-2">
                My Cart <FaBagShopping className="text-[#F33E0A]" />
              </button>
              <span className="text-sm">0 items - $0.00</span>
            </div>

            {token && role !== "USER" && (
              <Link
                className="py-2.5 px-4 flex items-center gap-2 bg-[#F33E0A] text-white"
                href="/vendors/addproducts"
              >
                Sell Your Stuff <ImHammer2 className="transform rotate-80" />
              </Link>
            )} */}

            <div className="flex flex-col items-center">
              {token ? (
                ""
              ) : (
                <div
                  className="py-2.5 px-4 flex items-center rounded-lg gap-2 bg-[#F33E0A] text-white"

                >
                  <Link
                    href="/register"
                    className="text-white text-sm font-medium  cursor-pointer"
                  >
                    Register
                  </Link>
                </div>
              )}


            </div>

            <div className="flex flex-col items-center">
              <div
                className="py-2.5 px-4 flex items-center rounded-lg gap-2  bg-[green] text-white"

              >
                {token ? (
                  <Link
                    href="/login"
                    onClick={() => {
                      Cookies.remove("token");
                      Cookies.remove("currentuser");
                    }}
                    className="text-white text-center text-sm font-medium  cursor-pointer"
                  >
                    Logout
                  </Link>
                ) : (
                  <Link href="/login" className="text-white text-sm font-medium ">
                    Log In
                  </Link>
                )}
              </div>

            </div>

            <div className="flex flex-col items-center">
              {token ? (
                <div
                  className="py-2.5 px-4 flex items-center rounded-lg gap-2  bg-[#F33E0A] text-white"

                >
                  <Link href="/dashboard/wonitem" className="text-white text-sm font-medium ">
                    Dashboard
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>


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
            <div className="flex flex-col md:flex-row items-center border border-gray-300 rounded-lg overflow-hidden w-full gap-2 md:gap-4 p-2">

              {/* Category Dropdown */}
              {/* <select
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  console.log("Selected Category ID:", selectedCategory);
                  if (selectedCategory === "") {
                    dispatch(clearFilteredProducts());
                  } else {
                    dispatch(filterByCategory(selectedCategory));
                  }
                }}
                className="py-2 px-2 w-full md:w-1/4 text-gray-700 outline-none bg-white border border-gray-300 rounded-md"
              >
                <option value="">Categories</option>
                {categories?.data?.map((category) => (
                  <option value={category?._id} key={category?._id}>
                    {category.name}
                  </option>
                ))}
              </select> */}

              {/* Sub Category Dropdown */}
              {/* <select
                onChange={(e) => {
                  const selectedSubCategory = e.target.value;
                  console.log("Selected Sub Category ID:", selectedSubCategory);
                  if (selectedSubCategory === "") {
                    dispatch(clearFilteredProducts());
                  } else {
                    dispatch(filterBySubCategory(selectedSubCategory));
                  }
                }}
                className="py-2 px-2 w-full md:w-1/4 text-gray-700 outline-none bg-white border border-gray-300 rounded-md"
              >
                <option value="">Sub Categories</option>
                {subcategories?.data?.map((subcategory) => (
                  <option value={subcategory?._id} key={subcategory?._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select> */}

              {/* Search Input + Search Button */}
              <div className="flex w-full md:flex-1 border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none text-gray-700 w-full"
                  onChange={(e) => dispatch(filterBySearch(e.target.value))}
                />
                <button className="p-3 bg-gray-800 text-white hover:bg-gray-900">
                  <FaSearch />
                </button>
              </div>

              {/* Clear Button */}
              <button
                onClick={() => dispatch(clearFilteredProducts())}
                className="py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 w-full md:w-auto"
              >
                Clear
              </button>

            </div>
          </div>


          {/* Cart & Sell Buttons */}
          <div className="mt-6">
            {/* <div className="flex flex-col items-center text-center">
              <button className="px-4 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  My Cart <FaBagShopping className="text-[#F33E0A]" />
                </div>
                <span className="text-sm">0 items - $0.00</span>
              </button>
            </div> */}


            {/* {token && role !== "USER" && (
              <Link
                  className="flex items-center justify-center gap-2 py-2 mt-3 bg-[#F33E0A] text-white rounded-md"
                  href="/vendors/addproducts"
                >
                  Sell Your Stuff <ImHammer2 className="transform rotate-80" />
                </Link>
            )} */}


            {token ? (
            <div
            className="flex items-center justify-center gap-2 py-2 mt-3 bg-[#F33E0A] text-white rounded-md"
          >
            <Link href="/dashboard/wonitem" className="text-white text-sm font-medium ">
            Dashboard
            </Link>
          </div>
            ) : (
             ""
            )}

            <div
              className="flex items-center justify-center gap-2 py-2 mt-3 bg-[green] text-white rounded-md"
            >
              {token ? (
                <Link
                  href="/login"
                  onClick={() => {
                    Cookies.remove("token");
                    Cookies.remove("currentuser");
                  }}
                  className="text-white text-sm font-medium  cursor-pointer"
                >
                  Logout
                </Link>
              ) : (
                <Link href="/login" className="text-white text-sm font-medium ">
                  Login
                </Link>
              )}
            </div>

            {token ? (
              ''
            ) : (
              <div
                className="flex items-center justify-center gap-2 py-2 mt-3 bg-[#F33E0A] text-white rounded-md"
              >
                <Link href="/register" className="text-white text-sm font-medium ">
                  Register
                </Link>
              </div>
            )}

          </div>
        </nav>
      </div>

      {/* Navbar Categories */}
      {/* <NavbarCat /> */}
    </>
  );
};

export default Navbar;
