import type { Metadata } from "next";
import { Afacad, Quicksand, Geist, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";


const interHeading = Inter({
  subsets:['latin'],
  variable:'--font-inter-sans'
});

const geist = Geist({
  subsets:['latin'],
  variable:'--font-geist-sans'
});

const afacad = Afacad({
  variable: "--font-heading",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Kita",
  description: "Kiosk Inventory, & Transaction Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", afacad.variable, quicksand.variable, "font-sans", geist.variable, interHeading.variable)}
    >
      <body className="min-h-full flex flex-col w-full">
        {children}
      </body>
    </html>
  );
}
