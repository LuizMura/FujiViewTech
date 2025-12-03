"use client";

import dynamic from "next/dynamic";

const HeroWrapperDynamic = dynamic(() => import("./HeroWrapper"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
  ),
});

export default function HeroWrapperClient() {
  return <HeroWrapperDynamic />;
}
