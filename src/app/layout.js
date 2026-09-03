import { Roboto } from "next/font/google";
import ReduxProvider from "./_Services/reduxprovider/reduxprovider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.zytronworld.online"
  ),
  title: {
    default: "CRM Zytron World",
    template: "%s | CRM Zytron World",
  },
  description: "Zytron World CRM — employees, sales, chat, and operations.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon.192.png",
  },
  appleWebApp: {
    capable: true,
    title: "CRM Zytron World",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#27272a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className} antialiased`}>
        <ReduxProvider>
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
        </ReduxProvider>
      </body>
    </html>
  );
}
