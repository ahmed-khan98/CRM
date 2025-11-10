"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/" || pathname === "/register" || pathname === "/login" || pathname === "/verifyemail" || pathname ===  "/forget"|| pathname ===  "/reset" || pathname ===  "/list";

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
