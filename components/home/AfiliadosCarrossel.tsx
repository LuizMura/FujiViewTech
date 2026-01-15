"use client";

import React, { useEffect, useRef, useState } from "react";
import AfiliadosCard from "./AfiliadosCard";
import CarrosselNavigation from "./CarrosselNavigation";
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

  if (loading) {
    return (
      <div className="afiliados-carrossel px-2 md:px-0 w-full">
        <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-2 md:mb-8">
          SELECIONADOS PARA VOCÊ
        </h2>
        <div className="flex gap-3 md:gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="flex-shrink-0 w-[150px] md:w-[200px] lg:w-[200px] h-[280px] bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
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
        <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-2 md:mb-8">
          SELECIONADOS PARA VOCÊ
        </h2>

        {/* Grid de cards */}
        <div className="relative">
          {/* Setas de navegação */}
          {produtos.length > 0 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-[-12px] md:left-[-40px] top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors shadow-lg"
                aria-label="Anterior"
              >
                <ChevronLeft size={isMobile ? 36 : 46} className="text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-[-12px] md:right-[-40px] top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors shadow-lg"
                aria-label="Próximo"
              >
                <ChevronRight
                  size={isMobile ? 36 : 46}
                  className="text-white"
                />
              </button>
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
