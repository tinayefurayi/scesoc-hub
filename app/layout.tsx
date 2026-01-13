import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SCESoc Engineering Hub",
  description: "The central knowledge base for Systems and Computer Engineering students at Carleton University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface-subtle text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
