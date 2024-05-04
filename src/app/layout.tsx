import type { Metadata } from "next";

import "./globals.css";

import { Inter, Allura } from "next/font/google";
import { CSSProperties } from "react";

const inter = Inter({ subsets: ["latin"] });
const allura = Allura({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Netflix Profile selector",
  description: "Netflix Profile selector",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-inter": inter.style.fontFamily,
          "--font-allura": allura.style.fontFamily,
        } as CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
