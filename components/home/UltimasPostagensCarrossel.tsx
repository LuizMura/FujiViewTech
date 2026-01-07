"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UltimasPostagensCarrosselProps {
  artigos: Article[];
}

const UltimasPostagensCarrossel: React.FC<UltimasPostagensCarrosselProps> = ({
  artigos,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

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
  const visibleItems = shuffled.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      return newIndex < 0 ? shuffled.length - itemsPerPage : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerPage;
      return newIndex >= shuffled.length ? 0 : newIndex;
    });
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Linha divisória */}
        <div className="border-t border-slate-300 mb-6"></div>

        {/* Controles de navegação */}
        {shuffled.length > itemsPerPage && (
          <div className="relative flex items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100">
              ÚLTIMAS POSTAGENS
            </h2>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={goToPrev}
                className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} className="text-slate-900" />
              </button>

              {/* Indicadores de página */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx * itemsPerPage)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPage
                        ? "bg-slate-900 w-6"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Página ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
                aria-label="Próximo"
              >
                <ChevronRight size={24} className="text-slate-900" />
              </button>
            </div>
          </div>
        )}

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {visibleItems.map((artigo) => (
            <Link key={artigo.id} href={`/${artigo.category}/${artigo.slug}`}>
              <div className="relative flex flex-col items-center bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {artigo.image ? (
                  <div className="w-full h-48 relative">
                    <Image
                      src={artigo.image}
                      alt={artigo.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="250px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-slate-200" />
                )}
                <div className="flex-1 flex flex-col justify-center px-3 py-3 w-full">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-3 text-center">
                    {artigo.title}
                  </h3>
                  {artigo.excerpt && (
                    <p className="text-xs text-slate-600 line-clamp-2 text-center mt-1">
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
  );
};

export default UltimasPostagensCarrossel;
