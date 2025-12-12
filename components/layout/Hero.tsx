// This is where the Hero component will be defined
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHero } from "@/context/HeroContext";
import LivePrices from "./LivePrices";
import HeroCard from "../HeroCard";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

export default function Hero() {
  const { heroContent, topCard, bottomCard } = useHero();
  const [categoryCards, setCategoryCards] = useState<
    Array<{ category: string; image: string | null }>
  >([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const articles: Article[] = await getArticles();
        // Extrai categorias únicas e pega a primeira imagem de cada categoria
        const categoryMap: Record<string, string | null> = {};
        articles.forEach((article) => {
          if (article.category && !(article.category in categoryMap)) {
            categoryMap[article.category] = article.image || null;
          }
        });
        setCategoryCards(
          Object.entries(categoryMap).map(([category, image]) => ({
            category,
            image,
          }))
        );
      } catch {
        setCategoryCards([]);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <div className="bg-white py-1 justify-center flex items-center rounded-2xl shadow-md mb-4 border border-slate-200">
        <LivePrices />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-32">
        <div className="lg:col-span-2 relative h-104 lg:h-112 rounded-2xl overflow-hidden shadow-2xl group">
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
            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">
                {heroContent.badge}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                {heroContent.mainTitle}
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-sky-400 text-4xl md:text-6xl font-extrabold">
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
        <div className="flex flex-col gap-6 h-auto lg:h-112">
          <HeroCard card={topCard} />
          <HeroCard card={bottomCard} />
        </div>
      </div>
      {/* Cards de todas as categorias */}
      {categoryCards.length > 0 && (
        <div className="w-full flex flex-wrap gap-4 justify-center mb-8">
          {categoryCards.map((cat) => (
            <Link
              key={cat.category}
              href={`/categoria/${cat.category}`}
              className="block w-48 h-32 rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200 hover:shadow-xl transition group relative"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.category}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl">
                  {cat.category}
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-slate-900/80 to-transparent p-2">
                <span className="text-white font-bold text-sm uppercase tracking-wide">
                  {cat.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
