import { Geist, Geist_Mono } from "next/font/google";
import LayoutWrapper from "./_Components/LayoutWrapper";
import ReduxProvider from "./_Services/reduxprovider/reduxprovider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CRM ZYTRON WORLD",
  description: "Develop by ZYTRON WORLD",
  manifest: "/manifest.webmanifest", // ✅ yeh add karo
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#27272a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content="#27272a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="apple-touch-icon" href="/favicon.ico" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {/* <LayoutWrapper> */}
          {/* <SocketProvider> */}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }}
          />
          {children}
          {/* </SocketProvider> */}
          {/* </LayoutWrapper> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
