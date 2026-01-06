import React, { useState, useEffect } from "react";
import CarrosselCard from "@/components/home/CarrosselCard";
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

  if (!artigos || artigos.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Badge Destaque da semana */}
      <div className="absolute top-8 left-12 z-30">
        <span className="px-4 py-1 bg-slate-100/70 backdrop-blur-sm text-black font-bold rounded-full text-sm tracking-wide">
          DESTAQUE DA SEMANA
        </span>
      </div>

      <div className="relative min-h-[300px] overflow-hidden">
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
              <CarrosselCard article={artigo} showAuthor={false} />
            </div>
          ))}
        </div>

        {/* Navpage e Paginação em dots */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-4 items-center z-20">
          <button
            className="mb-1 text-white/80 hover:text-white transition-colors duration-200"
            onClick={() => goTo(current - 1)}
            aria-label="Anterior"
          >
            <span className="text-2xl">&lt;</span>
          </button>

          <div className="flex gap-2">
            {artigos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70 w-2.5"
                }`}
                aria-label={`Ir para artigo ${idx + 1}`}
              />
            ))}
          </div>

          <button
            className="mb-1 text-white/80 hover:text-white transition-colors duration-200"
            onClick={() => goTo(current + 1)}
            aria-label="Próximo"
          >
            <span className="text-2xl">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtigosCarrossel;
