"use client";

import { useState, useEffect } from "react";
import { HeroProvider } from "@/context/HeroContext";
import Hero from "./Hero";

export default function HeroWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />;
  }

  return (
    <HeroProvider>
      <Hero />
    </HeroProvider>
  );
}
