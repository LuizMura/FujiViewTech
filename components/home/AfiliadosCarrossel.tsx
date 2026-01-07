"use client";

import React, { useState, useEffect } from "react";
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
  const visibleItems = produtos.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const goToPrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerPage;
      return newIndex < 0 ? produtos.length - itemsPerPage : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + itemsPerPage;
      return newIndex >= produtos.length ? 0 : newIndex;
    });
  };

  return (
    <div className="w-full">
      {/* Linha divisória */}
      <div className="border-t border-slate-300 mb-8"></div>

      {/* Controles de navegação */}
      {produtos.length > itemsPerPage && (
        <div className="relative flex items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100">
            SELECIONADOS PARA VOCÊ
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleItems.map((produto, idx) => (
          <AfiliadosCard
            key={idx}
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
                logo: produto.afiliado1_nome?.toLowerCase().includes("amazon")
                  ? "/images/amazon-logo.png"
                  : undefined,
              },
              {
                nome: produto.afiliado2_nome,
                url: produto.afiliado2_url,
                cor: produto.afiliado2_cor,
                texto: produto.afiliado2_texto,
                logo: produto.afiliado2_nome?.toLowerCase().includes("mercado")
                  ? "/images/mercadolivre-logo.png"
                  : undefined,
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default AfiliadosCarrossel;
