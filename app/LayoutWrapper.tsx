"use client";

import { HeroProvider } from "@/context/HeroContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroProvider>
      <Header />
      <main className="pt-30 pb-32 min-h-screen">{children}</main>
      <Footer />
    </HeroProvider>
  );
}
