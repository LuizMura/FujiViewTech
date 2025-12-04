"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHero } from "@/context/HeroContext";
import LivePrices from "./LivePrices";
import HeroDashboard from "./HeroDashboard";
import HeroCard from "./HeroCard";
import { Settings } from "lucide-react";

export default function Hero() {
  const { heroContent, topCard, bottomCard } = useHero();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setIsDashboardOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-sky-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-30 flex items-center gap-2 group"
        title="Editar Hero"
      >
        <Settings
          size={20}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
        <span className="hidden sm:inline text-sm font-semibold">
          Editar Hero
        </span>
      </button>

      {/* Dashboard */}
      <HeroDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      {/* Price Ticker */}
      <div className="bg-white py-1 px-4 rounded-2xl shadow-md mb-4 border border-slate-200">
        <LivePrices />
      </div>

      {/* Hero Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6 mb-16">
        {/* Main Feature (Left - 2/3) */}
        <div className="lg:col-span-2 relative h-[26rem] lg:h-[28rem] rounded-2xl overflow-hidden shadow-2xl group">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            {heroContent.imageUrl &&
            (heroContent.imageUrl.startsWith("/") ||
              heroContent.imageUrl.startsWith("http")) ? (
              <Image
                src={heroContent.imageUrl}
                alt={heroContent.imageAlt}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-slate-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                {heroContent.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                {heroContent.mainTitle}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                  {heroContent.gradientTitle}
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 font-light max-w-xl leading-relaxed hidden md:block">
                {heroContent.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={heroContent.buttonLink || "/"}
                  className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg text-sm md:text-base"
                >
                  {heroContent.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Side Column (Right - 1/3) */}
        <div className="flex flex-col gap-6 h-auto lg:h-[28rem]">
          {/* Top Card */}
          <HeroCard card={topCard} />

          {/* Bottom Card */}
          <HeroCard card={bottomCard} />
        </div>
      </div>
    </>
  );
}
