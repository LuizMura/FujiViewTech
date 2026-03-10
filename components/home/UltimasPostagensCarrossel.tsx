"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UltimasPostagensCarrosselProps {
  artigos: Article[];
  skipFirstItem?: boolean;
  title?: string;
  includeCategories?: string[];
  excludeCategories?: string[];
}

const UltimasPostagensCarrossel: React.FC<UltimasPostagensCarrosselProps> = ({
  artigos,
  skipFirstItem = true,
  title = "OUTRAS POSTAGENS",
  includeCategories,
  excludeCategories,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizeCategory = (value?: string | null) =>
    (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();

  const includeSet = includeCategories
    ? new Set(includeCategories.map((c) => normalizeCategory(c)))
    : null;
  const excludeSet = excludeCategories
    ? new Set(excludeCategories.map((c) => normalizeCategory(c)))
    : null;

  const sorted = artigos
    .filter((a) => {
      if (a.status !== "published") return false;
      const normalized = normalizeCategory(a.category);
      if (includeSet && !includeSet.has(normalized)) return false;
      if (excludeSet && excludeSet.has(normalized)) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      const timeA = dateA ? new Date(dateA).getTime() : 0;
      const timeB = dateB ? new Date(dateB).getTime() : 0;
      return timeB - timeA;
    });

  const preparedArticles = skipFirstItem ? sorted.slice(1) : sorted;

  // Mantém ordem estável após remover o item de destaque.
  const shuffled = preparedArticles;

  if (shuffled.length === 0) {
    return null;
  }

  const visibleItems = shuffled;

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      return newIndex < 0 ? shuffled.length - itemsPerPage : newIndex;
    });
    scrollToIndex();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerPage;
      return newIndex >= shuffled.length ? 0 : newIndex;
    });
    scrollToIndex();
  };

  const scrollToIndex = (index?: number) => {
    if (!containerRef.current) return;
    const targetIndex = index !== undefined ? index : currentIndex;
    const cardWidth =
      window.innerWidth < 768 ? 160 : window.innerWidth < 1024 ? 250 : 220;
    const gap = window.innerWidth < 768 ? 12 : 24;
    const scrollPosition = targetIndex * (cardWidth + gap);

    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full overflow-x-hidden md:overflow-visible">
      <div className="relative">
        <h2 className="text-1sm md:text-lg font-bold text-gray-700 pb-1 md:pb-2">
          {title}
        </h2>

        {/* Grid de cards */}
        <div className="relative overflow-x-hidden md:overflow-visible">
          {/* Setas de navegação */}
          {shuffled.length > 0 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-1 md:left-[-40px] top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full bg-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/50 transition-colors shadow-lg"
                aria-label="Anterior"
              >
                <ChevronLeft size={isMobile ? 28 : 46} className="text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-1 md:right-[-40px] top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full bg-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/50 transition-colors shadow-lg"
                aria-label="Próximo"
              >
                <ChevronRight
                  size={isMobile ? 28 : 46}
                  className="text-white"
                />
              </button>
            </>
          )}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-3 md:gap-6 mb-8 snap-x snap-mandatory scrollbar-hide w-full"
          >
            {visibleItems.map((artigo) => {
              const summary = artigo.excerpt || artigo.description || "";

              return (
                <Link
                  key={artigo.id}
                  href={`/artigos/${artigo.slug}`}
                  className="flex-shrink-0 w-[160px] md:w-[250px] lg:w-[220px] snap-start"
                >
                  <div className="relative flex flex-col items-center bg-white rounded-sm shadow border border-slate-300 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {artigo.image ? (
                      <div className="w-full h-40 md:h-48 relative">
                        <Image
                          src={artigo.image}
                          alt={artigo.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="250px"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 md:h-48 bg-slate-200" />
                    )}
                    <div className="flex-1 flex flex-col justify-center px-2 py-2 md:px-3 md:py-3 w-full">
                      <h3 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-3 text-center">
                        {artigo.title}
                      </h3>
                      {summary && (
                        <p className="text-[10px] md:text-xs text-slate-600 line-clamp-2 text-center mt-1">
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimasPostagensCarrossel;
