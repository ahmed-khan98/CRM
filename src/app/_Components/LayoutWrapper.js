// app/_Components/LayoutWrapper.js

"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Define all exact paths to hide
  const exactPathsToHide = [
    "/", 
    "/register", 
    "/login", 
    "/verifyemail", 
    "/forget",
    "/reset", 
    "/list"
  ];

  // Define paths that should be hidden along with all their sub-routes
  // "/pay" ke saath jitne bhi IDs (e.g., /pay/123) aayenge, woh sab hide ho jayenge.
  const routePrefixesToHide = [
      "/pay"
  ];
  
  // Check if the current pathname is an exact match OR starts with one of the prefixes
  const isExactMatch = exactPathsToHide.includes(pathname);
  const isPrefixMatch = routePrefixesToHide.some(prefix => pathname.startsWith(prefix));

  // Agar koi bhi condition match ho jaaye toh layout hide kar dein
  const hideLayout = isExactMatch || isPrefixMatch;

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}