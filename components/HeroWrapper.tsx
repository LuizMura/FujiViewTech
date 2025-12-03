"use client";

import dynamic from "next/dynamic";
import { HeroProvider } from "@/context/HeroContext";

const Hero = dynamic(() => import("./Hero"), { ssr: false });

export default function HeroWrapper() {
  return (
    <HeroProvider>
      <Hero />
    </HeroProvider>
  );
}
