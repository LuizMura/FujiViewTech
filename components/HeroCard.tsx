"use client";

import Link from "next/link";
import Image from "next/image";
import { CardContent } from "@/context/HeroContext";

interface HeroCardProps {
  card: CardContent;
}

const categoryColorMap: Record<string, string> = {
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
};

const categoryHoverMap: Record<string, string> = {
  sky: "group-hover:text-sky-300",
  emerald: "group-hover:text-emerald-300",
};

export default function HeroCard({ card }: HeroCardProps) {
  return (
    <Link
      href={card.link}
      className="flex-1 relative rounded-2xl overflow-hidden shadow-lg group block"
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={card.imageUrl}
          alt={card.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 z-10">
        <span
          className={`inline-block px-2 py-0.5 ${
            categoryColorMap[card.categoryColor]
          } text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2`}
        >
          {card.category}
        </span>
        <h3
          className={`text-xl font-bold text-white leading-tight transition-colors ${
            categoryHoverMap[card.categoryColor]
          }`}
        >
          {card.title}
        </h3>
      </div>
    </Link>
  );
}
