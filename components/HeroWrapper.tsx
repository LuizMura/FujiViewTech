"use client";

import dynamic from "next/dynamic";
import { HeroProvider } from "@/app/context/HeroContext";

const Hero = dynamic(() => import("./layout/Hero"), { ssr: false });

export default function HeroWrapper() {
  return (
    <HeroProvider>
      <Hero />
    </HeroProvider>
  );
}
