import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; 
import "./globals.css";
import LayoutWrapper from "./_Components/LayoutWrapper"; 
import ReduxProvider from "./_Services/reduxprovider/reduxprovider";
import { Toaster } from "react-hot-toast";
import SocketProvider from "./_Components/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CMS-PPI",
  description: "Develop by Penta Prime Innovation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
        <LayoutWrapper>
        <SocketProvider>
        <Toaster position="top-center" />
          {children}
        </SocketProvider>
          </LayoutWrapper>
        </ReduxProvider>
      </body>
     
    </html>
  );
}
