"use client";

import React, { useEffect, useRef, useState } from "react";
import AfiliadosCard from "./AfiliadosCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProdutoAfiliado {
  imagem: string;
  titulo: string;
  descricao: string;
  loja?: string;
  preco: string | number;
  afiliado_url?: string;
  afiliado1_nome: string;
  afiliado1_url: string;
  afiliado1_cor: string;
  afiliado1_texto: string;
  afiliado2_nome: string;
  afiliado2_url: string;
  afiliado2_cor: string;
  afiliado2_texto: string;
  created_at?: string;
  publicado_em?: string;
  id?: string | number;
}

interface AfiliadosCarrosselProps {
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
  smallArrows?: boolean;
  compact?: boolean;
}

const AfiliadosCarrossel: React.FC<AfiliadosCarrosselProps> = ({
  title = "SELECIONADOS PARA VOCÊ",
  emptyMessage,
  itemsPerPage = 5,
  smallArrows = false,
  compact = false,
}) => {
  const [produtos, setProdutos] = useState<ProdutoAfiliado[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const containerRef = useRef<HTMLDivElement>(null);

  const formatPreco = (v: unknown): string => {
    if (typeof v === "number" && Number.isFinite(v)) {
      try {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(v);
      } catch {
        return `R$ ${v}`;
      }
    }
    if (typeof v === "string") return v;
    return "R$ 0,00";
  };

  useEffect(() => {
    async function fetchAfiliados() {
      setLoading(true);
      const res = await fetch("/api/afiliados");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      const sorted = [...list].sort((a, b) => {
        const getTime = (v?: string | number | null) => {
          if (typeof v === "number") return v;
          if (!v) return 0;
          const t = new Date(v as string).getTime();
          return Number.isFinite(t) ? t : 0;
        };
        const aTime = getTime(a.created_at || a.publicado_em || a.id);
        const bTime = getTime(b.created_at || b.publicado_em || b.id);
        return bTime - aTime; // desc
      });
      setProdutos(sorted);
      setLoading(false);
    }
    fetchAfiliados();
  }, []);

  if (loading) {
    return (
      <div className="afiliados-carrossel w-full overflow-x-hidden">
        <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-2 md:mb-8">
          {title}
        </h2>
        <div
          className={`flex ${compact ? "gap-[10px] md:gap-4" : "gap-3 md:gap-6"} mb-8`}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`flex-shrink-0 ${compact ? "w-[130px] md:w-[176px] lg:w-[176px] h-[240px]" : "w-[150px] md:w-[200px] lg:w-[200px] h-[280px]"} bg-slate-800/50 rounded-xl animate-pulse`}
            />
          ))}
        </div>
      </div>
    );
  }
  if (!produtos.length) {
    if (emptyMessage) {
      return <div className="text-sm text-slate-500">{emptyMessage}</div>;
    }
    return null;
  }

  const visibleItems = produtos;
  const arrowMobileSize = smallArrows ? 22 : 28;
  const arrowDesktopSize = smallArrows ? 34 : 46;
  const arrowPadding = smallArrows ? "p-1 md:p-1.5" : "p-1 md:p-2";
  const mobileCardWidth = compact ? 130 : 150;
  const desktopCardWidth = compact ? 176 : 200;
  const mobileGap = compact ? 10 : 12;
  const desktopGap = compact ? 16 : 24;
  const cardWidthClass = compact
    ? "flex-shrink-0 w-[130px] md:w-[176px] lg:w-[176px] snap-start"
    : "flex-shrink-0 w-[150px] md:w-[200px] lg:w-[200px] snap-start";
  const cardsGapClass = compact ? "gap-[10px] md:gap-4" : "gap-3 md:gap-6";

  const scrollToIndex = (index: number) => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const cardWidth =
      window.innerWidth < 768
        ? mobileCardWidth
        : window.innerWidth < 1024
          ? desktopCardWidth
          : desktopCardWidth;
    const gap = window.innerWidth < 768 ? mobileGap : desktopGap;
    const scrollPosition = index * (cardWidth + gap);

    containerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
  };

  const goToPrev = () => {
    const newIndex =
      currentIndex - itemsPerPage < 0
        ? Math.max(produtos.length - itemsPerPage, 0)
        : currentIndex - itemsPerPage;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      currentIndex + itemsPerPage >= produtos.length
        ? 0
        : currentIndex + itemsPerPage;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  return (
    <div className="w-full overflow-x-hidden md:overflow-visible">
      <div className="relative">
        <h2 className="text-lg md:text-2xl font-bold text-slate-700 mb-2 md:mb-8">
          {title}
        </h2>

        {/* Grid de cards */}
        <div className="relative overflow-x-hidden md:overflow-visible">
          {/* Setas de navegação */}
          {produtos.length > 0 && (
            <>
              <button
                onClick={goToPrev}
                className={`absolute left-1 md:left-[-40px] top-1/2 -translate-y-1/2 z-10 ${arrowPadding} rounded-full bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors shadow-lg`}
                aria-label="Anterior"
              >
                <ChevronLeft
                  size={isMobile ? arrowMobileSize : arrowDesktopSize}
                  className="text-white"
                />
              </button>
              <button
                onClick={goToNext}
                className={`absolute right-1 md:right-[-40px] top-1/2 -translate-y-1/2 z-10 ${arrowPadding} rounded-full bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors shadow-lg`}
                aria-label="Próximo"
              >
                <ChevronRight
                  size={isMobile ? arrowMobileSize : arrowDesktopSize}
                  className="text-white"
                />
              </button>
            </>
          )}
          <div
            ref={containerRef}
            className={`flex overflow-x-auto ${cardsGapClass} mb-8 snap-x snap-mandatory scrollbar-hide w-full`}
          >
            {visibleItems.map((produto, idx) => (
              <div
                key={produto.id ?? `${produto.titulo}-${idx}`}
                className={cardWidthClass}
              >
                <AfiliadosCard
                  imagem={produto.imagem}
                  titulo={produto.titulo}
                  descricao={produto.descricao}
                  loja={produto.loja || "Loja"}
                  preco={formatPreco(produto.preco)}
                  afiliados={[
                    {
                      nome: produto.afiliado1_nome || produto.loja || "Loja",
                      url: produto.afiliado1_url || produto.afiliado_url || "",
                      cor: produto.afiliado1_cor,
                      texto: produto.afiliado1_texto,
                      logo: produto.afiliado1_nome
                        ?.toLowerCase()
                        .includes("amazon")
                        ? "/images/amazon-logo.png"
                        : undefined,
                    },
                    {
                      nome: produto.afiliado2_nome,
                      url: produto.afiliado2_url,
                      cor: produto.afiliado2_cor,
                      texto: produto.afiliado2_texto,
                      logo: produto.afiliado2_nome
                        ?.toLowerCase()
                        .includes("mercado")
                        ? "/images/mercadolivre-logo.png"
                        : undefined,
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfiliadosCarrossel;
