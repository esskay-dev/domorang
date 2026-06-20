import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Domorang — Verified Property Listings in Abuja",
  description: "Early access. Verified listings. No fake agents. Just real homes in Abuja done right.",
  openGraph: {
    title: "Domorang — Be First When We Launch",
    description: "Verified listings. No fake agents. Just real homes in Abuja done right.",
    url: "https://waitlist.domorang.com",
    siteName: "Domorang",
    images: [
      {
        url: "https://waitlist.domorang.com/og-image.png",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
