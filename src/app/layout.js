import localFont from "next/font/local";
import ReduxProvider from "./_Services/reduxprovider/reduxprovider";
import { Toaster } from "react-hot-toast";
import NumberInputGuard from "./_Components/NumberInputGuard";
import "./globals.css";

/** Self-hosted — avoids next/font/google build flake on extensionless Google URLs */
const plusJakarta = localFont({
  src: [
    {
      path: "./fonts/plus-jakarta-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/plus-jakarta-sans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-brand",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
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
