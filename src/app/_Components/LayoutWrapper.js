// app/_Components/LayoutWrapper.js

"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const exactPathsToHide = [
    "/",
    "/register",
    "/login",
    "/verifyemail",
    "/forget",
    "/reset",
    "/list",
  ];

  const routePrefixesToHide = ["/pay"];

  const isExactMatch = exactPathsToHide.includes(pathname);
  const isPrefixMatch = routePrefixesToHide.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const hideLayout = isExactMatch || isPrefixMatch;

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
