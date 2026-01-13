"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";
import CarrosselNavigation from "./CarrosselNavigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UltimasPostagensCarrosselProps {
  artigos: Article[];
}

const UltimasPostagensCarrossel: React.FC<UltimasPostagensCarrosselProps> = ({
  artigos,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const containerRef = useRef<HTMLDivElement>(null);

  // Ordena por createdAt descending, ignora o 1º (no carrossel) e pega aleatórios dos penúltimos
  const sorted = artigos
    .filter((a) => a.status === "published")
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(1);

  // Pega aleatórios dos penúltimos
  const shuffled = sorted.sort(() => 0.5 - Math.random());

  if (shuffled.length === 0) return null;

  const totalPages = Math.ceil(shuffled.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage);
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
      window.innerWidth < 768 ? 180 : window.innerWidth < 1024 ? 250 : 220;
    const gap = window.innerWidth < 768 ? 12 : 24;
    const scrollPosition = targetIndex * (cardWidth + gap);

    containerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-2 md:px-0 w-full">
      <div className="relative">
        {/* Controles de navegação */}
        {!isMobile && shuffled.length > itemsPerPage && (
          <CarrosselNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={goToPrev}
            onNext={goToNext}
            onPageClick={(idx) => {
              setCurrentIndex(idx * itemsPerPage);
              scrollToIndex(idx * itemsPerPage);
            }}
            title="ÚLTIMAS POSTAGENS"
          />
        )}

        {isMobile && (
          <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-2 md:mb-8">
            ÚLTIMAS POSTAGENS
          </h2>
        )}

        {/* Grid de cards */}
        <div className="relative">
          {/* Setas de navegação */}
          {shuffled.length > 0 && (
            <>
              <div className="absolute left-[-12px] md:left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none p-1.5 md:p-2 rounded-full bg-white/30 backdrop-blur-sm">
                <ChevronLeft size={24} className="text-white" />
              </div>
              <div className="absolute right-[-12px] md:right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none p-1.5 md:p-2 rounded-full bg-white/30 backdrop-blur-sm">
                <ChevronRight size={24} className="text-white" />
              </div>
            </>
          )}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-3 md:gap-6 mb-8 snap-x snap-mandatory scrollbar-hide w-full"
          >
            {visibleItems.map((artigo) => (
              <Link
                key={artigo.id}
                href={`/artigos/${artigo.slug}`}
                className="flex-shrink-0 w-[180px] md:w-[250px] lg:w-[220px] snap-start"
              >
                <div className="relative flex flex-col items-center bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                    {artigo.excerpt && (
                      <p className="text-[10px] md:text-xs text-slate-600 line-clamp-2 text-center mt-1">
                        {artigo.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimasPostagensCarrossel;
