import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Elm — Yale student marketplace",
  description: "Buy and sell with verified Yale students. Tickets, textbooks, and dorm stuff, with names and ratings attached.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fraunces.variable} font-sans`}>
        <Header />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t border-line px-4 py-8 text-center text-sm text-mute">
          <p className="font-serif text-lg italic text-yale">elm</p>
          <p className="mx-auto mt-1 max-w-md">
            A campus marketplace for verified @yale.edu students. Built for the y/cs × SpaceXSI Grokathon. Not an official Yale service.
          </p>
        </footer>
      </body>
    </html>
  );
}
