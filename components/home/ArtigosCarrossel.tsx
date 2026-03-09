import React, { useState, useEffect } from "react";
import CarrosselCard from "@/components/home/CarrosselCard";
import { Article } from "@/lib/types/article";

interface ArtigosCarrosselProps {
  artigos: Article[];
}

const ArtigosCarrossel: React.FC<ArtigosCarrosselProps> = ({ artigos }) => {
  const [current, setCurrent] = useState(0);
  const total = artigos.length;
  const AUTO_PLAY_ENABLED = false;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Distância mínima para considerar um swipe (em pixels)
  const minSwipeDistance = 50;

  const goTo = (idx: number) => {
    if (idx < 0) setCurrent(total - 1);
    else if (idx >= total) setCurrent(0);
    else setCurrent(idx);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goTo(current + 1);
    } else if (isRightSwipe) {
      goTo(current - 1);
    }
  };

  // Autoplay
  useEffect(() => {
    if (!AUTO_PLAY_ENABLED || total <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 7000); // 7 segundos

    return () => clearInterval(timer);
  }, [AUTO_PLAY_ENABLED, total]);

  if (!artigos || artigos.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Badge Destaque da semana */}
      <div className="absolute top-4 left-2 md:top-6 md:left-7 z-30">
        <span className="px-2 md:px-4 py-0.5 md:py-1 bg-amber-300/70 backdrop-blur-sm text-black font-bold rounded-full text-xs md:text-sm tracking-wide">
          DESTAQUE DA SEMANA
        </span>
      </div>

      <div className="relative min-h-[300px] overflow-hidden">
        <div
          className="whitespace-nowrap transition-transform duration-700"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
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
      </div>

      {/* Navpage e Paginação em dots */}
      <div className="relative -mt-13 md:mt-0 md:absolute md:bottom-1 left-0 md:left-1/2 md:-translate-x-1/2 flex justify-center gap-4 items-center z-30">
        <button
          className="hidden md:block mb-1 text-white/80 hover:text-white transition-colors duration-200"
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
              className={`h-1.5 md:h-2.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-white w-4 md:w-8"
                  : "bg-white/50 hover:bg-white/70 w-1.5 md:w-2.5"
              }`}
              aria-label={`Ir para artigo ${idx + 1}`}
            />
          ))}
        </div>

        <button
          className="hidden md:block mb-1 text-white/80 hover:text-white transition-colors duration-200"
          onClick={() => goTo(current + 1)}
          aria-label="Próximo"
        >
          <span className="text-2xl">&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default ArtigosCarrossel;
