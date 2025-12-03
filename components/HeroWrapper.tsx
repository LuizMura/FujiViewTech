"use client";

import { HeroProvider } from "@/context/HeroContext";
import Hero from "./Hero";

export default function HeroWrapper() {
  return (
    <HeroProvider>
      <Hero />
    </HeroProvider>
  );
}
