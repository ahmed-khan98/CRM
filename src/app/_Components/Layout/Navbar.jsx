"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Main from "../../../app/Assets/logo-ppi.png"
import { Search, X, Menu } from "lucide-react"

import { filterBySearch, clearFilteredProducts } from "@/redux/filterSlice"
import LeftNav from "../Dashboard/LeftNav"

const Navbar = () => {
  const router = useRouter()
  const token = Cookies.get("token")
  
  const filteredProducts = useSelector((state) => state.filter.filteredProducts)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleLogout = () => {
    setIsMenuOpen(!isMenuOpen)
    Cookies.remove("token")
    Cookies.remove("currentuser")
    router.push("/login")
  }

  const renderAuthButtons = () => (
    <>

      <button
        onClick={() => (token ? handleLogout() : router.push("/login"))}
        className={`cursor-pointer py-2 px-3 rounded text-white text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity ${token ? "bg-[#5f2781]" : "bg-[#a945fc]"
          }`}
      >
        {token ? "Logout" : "Log In"}
      </button>

      {token && (
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen)
            router.push("/dashboard/dashboardcount")
          }}
          className="cursor-pointer py-2 px-3 bg-[#5f2781] text-white rounded text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity"
        >
          Dashboard
        </button>
      )}
    </>
  )

  return (
    <>
      {/* Main Navbar */}
      <div className="bg-white border-b border-[#DDDDDD7D] fixed top-0 left-0 w-full z-50">
        <nav className="container  md:px-10 px-2 py-1 flex justify-between items-center">
          <Link href="/dashboard/dashboardcount" className="w-60">
            <Image src={Main || "/placeholder.svg"} alt="Logo" height={60} />
          </Link>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-2">

            <button className="p-1 text-[#5f2781]" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              <Menu size={30} />
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4 text-black">{renderAuthButtons()}</div>
        </nav>
      </div>

    

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/20 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <nav className="fixed top-0 left-0 h-full w-80 bg-white p-3 shadow-md">
          <div className="flex justify-between items-center mb-[#5f2781]">
            <Link href="/dashboard/dashboardcount">
              <Image src={Main || "/placeholder.svg"} alt="Logo" width={100} height={30} />
            </Link>

            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={24} />
            </button>
          </div>

          {token ? (
            <LeftNav set={() => setIsMenuOpen(false)} />
          ) : (
            <div className="flex flex-col gap-3 mt-6">{renderAuthButtons()}</div>
          )}
        </nav>
      </div>
    </>
  )
}

export default Navbar
