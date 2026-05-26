import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-gray-800 bg-gray-50 pt-[88px] md:pt-[96px]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}