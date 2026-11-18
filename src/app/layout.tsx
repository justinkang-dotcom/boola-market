import type { Metadata } from "next";
import { EB_Garamond, Outfit } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const garamond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond" });

export const metadata: Metadata = {
  title: "Elm — Yale student marketplace",
  description: "Buy and sell with verified Yale students. Tickets, textbooks, and dorm stuff, with names and ratings attached.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${garamond.variable} font-sans`}>
        <Header />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-line px-4 py-8 text-center text-sm text-mute">
          <p className="font-serif text-lg italic text-yale">elm</p>
          <p className="mx-auto mt-1 max-w-md">
            Boola Boola deals for verified @yale.edu students. Built for the y/cs × SpaceXSI Grokathon. Not an official Yale service, and Handsome Dan did not actually review these listings.
          </p>
        </footer>
      </body>
    </html>
  );
}
