"use client";

import { useState, useEffect } from "react";
import LeftNav from "../_Components/Dashboard/LeftNav";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsMobile(true);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col py-14 md:py-18">


      <div className="flex flex-1 relative">


        {/* Overlay for mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/20 z-20"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } ${
            isMobile
              ? "fixed top-0 left-0 h-full z-30 w-78 shadow-xl"
              : "lg:relative lg:w-64 xl:w-64"
          } h-158 transition-transform duration-300 ease-in-out mt-15 md:mt-0`}
        >
          <LeftNav />
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out
            ${isMobile ? "w-full" : ""}`}
        >
          <div className="w-full bg-gradient-to-b from-purple-50 to-purple-100 h-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
//    ${
//   isSidebarOpen && !isMobile ? "lg:ml-64 xl:ml-72" : ""
// }
