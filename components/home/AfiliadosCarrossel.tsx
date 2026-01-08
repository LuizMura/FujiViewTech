"use client";

import React, { useEffect, useRef, useState } from "react";
import AfiliadosCard from "./AfiliadosCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Afiliado {
  nome: string;
  url: string;
  cor?: string;
  texto?: string;
  logo?: string;
}

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

const AfiliadosCarrossel: React.FC = () => {
  const [produtos, setProdutos] = useState<ProdutoAfiliado[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;
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

  if (loading) return <div>Carregando afiliados...</div>;
  if (!produtos.length) return <div>Nenhum produto afiliado encontrado.</div>;

  const totalPages = Math.ceil(produtos.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage);
  const visibleItems = produtos;

  const scrollToIndex = (index: number) => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const cardWidth =
      window.innerWidth < 768 ? 160 : window.innerWidth < 1024 ? 220 : 200;
    const gap = window.innerWidth < 768 ? 12 : 24;
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
    <div className="px-2 md:px-0 w-full">
      <div className="relative">
        {/* Linha divisória */}
        <div className="border-t border-slate-300 mb-4 md:mb-6"></div>

        {/* Controles de navegação */}
        <div className="relative flex items-center mb-2 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold text-slate-100">
            SELECIONADOS PARA VOCÊ
          </h2>

          {!isMobile && produtos.length > itemsPerPage && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4">
              <button
                onClick={goToPrev}
                className="p-1.5 md:p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
                aria-label="Anterior"
              >
                <ChevronLeft
                  size={20}
                  className="md:w-6 md:h-6 text-slate-900"
                />
              </button>

              {/* Indicadores de página */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const target = idx * itemsPerPage;
                      setCurrentIndex(target);
                      scrollToIndex(target);
                    }}
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
                className="p-1.5 md:p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors disabled:opacity-50"
                aria-label="Próximo"
              >
                <ChevronRight
                  size={20}
                  className="md:w-6 md:h-6 text-slate-900"
                />
              </button>
            </div>
          )}
        </div>

        {/* Grid de cards */}
        <div className="relative">
          {/* Setas de navegação */}
          {produtos.length > 0 && (
            <>
              <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-10 pointer-events-none p-1.5 md:p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <ChevronLeft size={24} className="text-white" />
              </div>
              <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-10 pointer-events-none p-1.5 md:p-2 rounded-full bg-black/30 backdrop-blur-sm">
                <ChevronRight size={24} className="text-white" />
              </div>
            </>
          )}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-3 md:gap-6 mb-8 snap-x snap-mandatory scrollbar-hide w-full"
          >
            {visibleItems.map((produto, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[200px] snap-start"
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
