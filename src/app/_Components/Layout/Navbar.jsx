"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Main from "../../../app/Assets/Main.png"
import { Search, X, Menu } from "lucide-react"

import { filterBySearch, clearFilteredProducts } from "@/redux/filterSlice"
import LeftNav from "../Dashboard/LeftNav"

const Navbar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const token = Cookies.get("token")
  const filteredProducts = useSelector((state) => state.filter.filteredProducts)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    dispatch(filterBySearch(value))
  }

  const handleLogout = () => {
    setIsMenuOpen(!isMenuOpen)
    Cookies.remove("token")
    Cookies.remove("currentuser")
    router.push("/login")
  }

  const clearSearch = () => {
    setSearchTerm("")
    dispatch(clearFilteredProducts())
  }

  const handleProductSelect = (product) => {
    setSearchTerm("")
    setIsMobileSearchOpen(false)
    dispatch(clearFilteredProducts())
    router.push(`/detailproduct/${product._id}`)
  }

  const renderDesktopSearchBar = () => (
    <div className="relative w-[600px]">
      <div
        className={`flex items-center bg-white border border-[#E9EFF4] rounded-full overflow-hidden ${searchTerm ? "border-red-500" : "border-[#E9EFF4]"} `}
      >
        {searchTerm && (
          <button onClick={clearSearch} className="cursor-pointer p-3 text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        )}
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-4 py-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <button
          onClick={() => router.push("/closing-products")}
          className="cursor-pointer p-3 bg-gray-800 text-white rounded-r-full w-[100px] hover:bg-gray-900 transition-colors"
        >
          {searchTerm ? "Search" : "Auction"}
        </button>
      </div>

      {searchTerm && filteredProducts.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-lg border border-gray-200 rounded-b-lg max-h-60 overflow-y-auto z-50">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              onClick={() => handleProductSelect(product)}
              className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium">{product.name}</div>
              {product.category && <div className="text-xs text-gray-500 mt-1">{product.category}</div>}
            </li>
          ))}
        </ul>
      )}
      {searchTerm && filteredProducts.length === 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl shadow-lg mt-1">
          <div className="px-4 py-6 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-2 text-gray-300" />
            <div className="font-medium">No products found</div>
            <div className="text-sm">Try different keywords</div>
          </div>
        </div>
      )}

    </div>
  )

  const renderAuthButtons = () => (
    <>
      {!token && (
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen)
            router.push("/register")
          }}
          className="cursor-pointer py-2.5 px-3 orange-bg text-white rounded-lg text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity"
        >
          Register
        </button>
      )}
      <button
        onClick={() => (token ? handleLogout() : router.push("/login"))}
        className={`cursor-pointer py-2.5 px-3 rounded-lg text-white text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity ${token ? "orange-bg" : "bg-[#2F318B]"
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
          className="cursor-pointer py-2.5 px-3 orange-bg text-white rounded-lg text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity"
        >
          Dashboard
        </button>
      )}

      <button
        onClick={() => {
          setIsMenuOpen(!isMenuOpen)
          router.push("/sell")
        }}
        className="cursor-pointer py-2.5 px-3 bg-[#007E38] text-white rounded-lg text-sm font-medium whitespace-nowrap shadow hover:opacity-90 transition-opacity"
      >
        Sell Your Stuff
      </button>
    </>
  )

  return (
    <>
      {/* Main Navbar */}
      <div className="bg-[#FFFFFF] border-b border-[#DDDDDD7D] fixed top-0 left-0 w-full z-50">
        <nav className="container mx-auto md:px-10 px-2 py-2 flex justify-between items-center">
          <Link href="/" className="w-45">
            <Image src={Main || "/placeholder.svg"} alt="Logo" height={50} />
          </Link>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Toggle Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => router.push("/closing-products")}
              className="cursor-pointer py-2 px-3 orange-bg text-white rounded-lg text-sm font-medium whitespace-nowrap shadow"
            >
              Browse
            </button>

            <button className="p-1 text-[#F33E0A]" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              <Menu size={30} />
            </button>
          </div>

          {/* Desktop Search */}
          <ul className="hidden lg:flex items-center space-x-6 !list-none capitalize">
            <li>{renderDesktopSearchBar()}</li>
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4 text-black">{renderAuthButtons()}</div>
        </nav>
      </div>

      {/* Mobile Search Bar - Fixed */}
      {isMobileSearchOpen && (
        <div className="fixed top-[65px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 lg:hidden">
          <div className="px-4 py-2">
            <div className="relative">
              <div
                className={`flex items-center bg-gray-50 border-2 rounded-full overflow-hidden transition-colors ${searchTerm ? "border-orange-500 bg-white" : "border-gray-200"}`}
              >
                <div className="pl-4 pr-2">
                  <Search size={20} className="text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-2 py-3 outline-none text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoFocus
                />

                {searchTerm && (
                  <button onClick={clearSearch} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (searchTerm) {
                      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
                    } else {
                      router.push("/closing-products")
                    }
                    setIsMobileSearchOpen(false)
                  }}
                  className="px-4 py-3 bg-gray-800 text-white font-medium hover:bg-gray-900 transition-colors"
                >
                  {searchTerm ? "Search" : "Auction"}
                </button>
              </div>

              {/* Mobile Search Results */}
              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-64 overflow-y-auto mt-1">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-gray-800 capitalize">{product.name}</div>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm && filteredProducts.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl shadow-lg mt-1">
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Search size={32} className="mx-auto mb-2 text-gray-300" />
                    <div className="font-medium">No products found</div>
                    <div className="text-sm">Try different keywords</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-sm bg-black/20 transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <nav className="fixed top-0 left-0 h-full w-80 bg-white p-4 shadow-md">
          <div className="flex justify-between items-center mb-5">
            <Link href="/">
              <Image src={Main || "/placeholder.svg"} alt="Logo" width={120} height={50} />
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
