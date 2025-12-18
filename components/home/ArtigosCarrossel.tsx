import React, { useState, useEffect } from "react";
import ArtigoCard from "@/app/artigos/ArtigoCard";
import { Article } from "@/lib/types/article";

interface ArtigosCarrosselProps {
  artigos: Article[];
}

const ArtigosCarrossel: React.FC<ArtigosCarrosselProps> = ({ artigos }) => {
  const [current, setCurrent] = useState(0);
  const total = artigos.length;

  const goTo = (idx: number) => {
    if (idx < 0) setCurrent(total - 1);
    else if (idx >= total) setCurrent(0);
    else setCurrent(idx);
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 7000); // 7 segundos
    return () => clearInterval(timer);
  }, [total]);

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <div className="relative min-h-[300px] overflow-hidden">
        {/* Badge fixo no carrossel */}
        <span className="absolute top-6 left-6 z-30 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Destaque da semana
        </span>
        <div
          className="whitespace-nowrap transition-transform duration-700"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {artigos.map((artigo) => (
            <div
              key={artigo.slug}
              className="inline-block align-top w-full"
              style={{ verticalAlign: "top" }}
            >
              <ArtigoCard post={artigo} showAuthor={false} />
            </div>
          ))}
        </div>
        {/* Navegação */}
        <button
          className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-indigo-600 rounded-full p-1 shadow z-20 border border-white/40 transition-colors duration-200"
          onClick={() => goTo(current - 1)}
          aria-label="Anterior"
        >
          <span className="text-2xl">&lt;</span>
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-indigo-600 rounded-full p-1 shadow z-20 border border-white/40 transition-colors duration-200"
          onClick={() => goTo(current + 1)}
          aria-label="Próximo"
        >
          <span className="text-2xl">&gt;</span>
        </button>
        {/* Paginação fixa como badges no canto do carrossel */}
        <div className="absolute left-6 bottom-6 z-30 flex gap-2">
          {artigos.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-indigo-600" : "bg-slate-300"}`}
              onClick={() => goTo(idx)}
              aria-label={`Ir para o slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtigosCarrossel;
