import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Domorang — Real Estate You Can Trust in Abuja",
  description: "Discover verified properties, connect with trusted agents and landlords, and make confident property decisions—all in one place.",
  openGraph: {
    title: "Domorang — Real Estate You Can Trust in Abuja",
    description: "Verified listings only. Zero scams. Discover verified properties and connect with trusted agents and landlords in Abuja.",
    url: "https://www.domorang.com",
    siteName: "Domorang",
    images: [
      {
        url: "https://www.domorang.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}