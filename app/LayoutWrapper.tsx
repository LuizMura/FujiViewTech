"use client";

import { HeroProvider } from "@/context/HeroContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
      <Header />
      <main className="pt-20 pb-32 min-h-screen">{children}</main>
      <Footer />
    </HeroProvider>
  );
}
