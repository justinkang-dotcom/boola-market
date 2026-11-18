import type { Metadata } from "next";
import { EB_Garamond, Outfit } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const garamond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond" });

export const metadata: Metadata = {
  title: "Boola Market — Yale student marketplace",
  description: "Where Yale's supply meets demand. Verified sellers, honest reviews, no lemons.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${garamond.variable} font-sans`}>
        <Header />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-line px-4 py-8 text-center text-sm text-mute">
          <p className="font-serif text-lg text-yale">Boola Market</p>
          <p className="mx-auto mt-1 max-w-lg">
            Where Yale's supply meets demand. Verified sellers, honest reviews, no lemons. Built for the y/cs × SpaceXSI Grokathon. Not an official Yale service.
          </p>
        </footer>
      </body>
    </html>
  );
}
