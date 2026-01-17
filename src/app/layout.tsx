import type { Metadata } from "next";
import { Geist, Geist_Mono, Vollkorn } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Colleko - Find Your Study Crew",
  description: "Connect with university students near you for study sessions and meetups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${vollkorn.variable}`}>
        {children}
      </body>
    </html>
  );
}
