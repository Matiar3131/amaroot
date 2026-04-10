import type { Metadata, Viewport } from "next"; // Viewport টাইপ অ্যাড করা হয়েছে
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

// ১. মেটাডাটা একবারই ডিক্লেয়ার করুন
export const metadata: Metadata = {
  title: "Amaroot | আমার শেকড়, আমার পরিচয়",
  description: "Identity-based Auto Networking Platform",
};

// ২. ভিউপোর্ট আলাদাভাবে এক্সপোর্ট করতে হয় (Next.js এর নতুন নিয়ম অনুযায়ী)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}