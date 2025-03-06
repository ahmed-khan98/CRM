import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

const NavbarCat = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#F33E0A] py-3.5 relative">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-10">
       <div className="flex gap-3">
         {/* Left Section (Categories Button) */}
         <div
          className="flex items-center bg-white px-4 py-2 cursor-pointer relative z-10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars className="text-black mr-2" />
          <span className="text-black font-medium">CATEGORIES</span>
        </div>

        {/* Center Navigation Links - Desktop */}
        <ul className="hidden md:flex items-center space-x-6 text-white text-sm font-medium">
  {[
    { name: "Home", path: "/" },
    { name: "Home 1", path: "/home" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Shop",path: "/" },
    { name: "Vendors",path: "/" },
    { name: "Shortcodes",path: "/" },
    { name: "Blog", path: "/" },
    { name: "Media",path: "/"  },
    { name: "About",path: "/" },
    { name: "Contact",path: "/"  },
    { name: "Pages", path: "/" }
  ].map((item) => (
    <li key={item.name}>
      <Link href={item.path} className="hover:underline">
        {item.name}
      </Link>
    </li>
  ))}
</ul>
       </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <>
            {/* Background Overlay */}
            <div
              className="fixed inset-0 bg-black opacity-50 z-10"
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* Mobile Menu */}
            <ul className="absolute top-full left-0 w-full bg-[#F33E0A] flex flex-col items-start py-3 space-y-2 text-white text-sm font-medium md:hidden z-20 shadow-lg">
              {["Home", "Shop", "Vendors", "Shortcodes", "Blog", "Media", "About", "Contact", "Pages"].map((item) => (
                <li key={item} className="pl-4 w-full">
                  <a href="#" className="block w-full py-2 hover:bg-[#d12b06]">{item}</a>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Right Section (Sign In) */}
        <div>
          <a href="#" className="text-white text-sm font-medium hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavbarCat;
