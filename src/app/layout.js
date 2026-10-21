import { Plus_Jakarta_Sans } from "next/font/google";
import ReduxProvider from "./_Services/reduxprovider/reduxprovider";
import { Toaster } from "react-hot-toast";
import NumberInputGuard from "./_Components/NumberInputGuard";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.zytronworld.online"
  ),
  title: {
    default: "zyro CRM",
    template: "%s | zyro",
  },
  description: "zyro CRM — employees, sales, chat, and operations.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/zyro-mark.jpg", type: "image/jpeg" },
      { url: "/favicon.jpg", type: "image/jpeg" },
    ],
    apple: "/brand/zyro-mark.jpg",
  },
  appleWebApp: {
    capable: true,
    title: "zyro",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#27272a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${plusJakarta.className} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <NumberInputGuard />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "12px",
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
