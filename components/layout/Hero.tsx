import AfiliadosList from "@/components/home/AfiliadosList";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHero } from "@/context/HeroContext";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import NoticiasCard from "@/components/home/NoticiasCard";
import EconomiaCard from "@/components/home/EconomiaCard";
import CategoriaCard from "@/components/home/CategoriaCard";
import LivePrices from "./LivePrices";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

export default function Hero() {
  const { heroContent, topCard, bottomCard } = useHero();
  const safeHeroContent = heroContent || {};
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [noticiasArticles, setNoticiasArticles] = useState<Article[]>([]);
  const [economiaArticles, setEconomiaArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const articles: Article[] = await getArticles({ limit: 5 });
        setLatestArticles(articles);
        const noticias: Article[] = await getArticles({ category: "noticias", limit: 5 });
        setNoticiasArticles(noticias);
        const economia: Article[] = await getArticles({ category: "economia", limit: 5 });
        setEconomiaArticles(economia);
        // Buscar todos para os cards genéricos
        const all: Article[] = await getArticles({ limit: 20 });
        setAllArticles(all);
      } catch {
        setLatestArticles([]);
        setNoticiasArticles([]);
        setEconomiaArticles([]);
        setAllArticles([]);
      }
    }
    fetchArticles();
  }, []);

  return (
    <>
      <div className="bg-white py-1 justify-center flex items-center rounded-2xl shadow-md mb-4 border border-slate-200">
        <LivePrices />
      </div>
      {/* 5 últimos artigos postados em carrossel */}
      {latestArticles.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2">
              <div className="relative w-full aspect-video md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                <ArtigosCarrossel artigos={latestArticles} />
              </div>
            </div>
            <div>
              {/* Notícias da categoria 'noticias' */}
              <React.Suspense fallback={<div>Carregando notícia...</div>}>
                <NoticiasCard artigos={noticiasArticles} />
                <div className="mt-4">
                  <EconomiaCard artigos={economiaArticles} />
                </div>
              </React.Suspense>
            </div>
          </div>
          
          {/* Cards de categorias com imagem acima e texto abaixo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <CategoriaCard artigos={allArticles} categoria="dicas" badgeColor="#6366f1" badgeLabel="Dicas" />
            <CategoriaCard artigos={allArticles} categoria="reviews" badgeColor="#f59e42" badgeLabel="Review" />
            <CategoriaCard artigos={allArticles} categoria="produtos" badgeColor="#10b981" badgeLabel="Tutorial" />
            <CategoriaCard artigos={allArticles} categoria="novidades" badgeColor="#ef4444" badgeLabel="Novidades" />
            <CategoriaCard artigos={allArticles} categoria="saude" badgeColor="#14b8a6" badgeLabel="Saúde" />
          </div>
        </>
      )}
      {/* <div className="mb-32">
        <ArtigosDestaque />
      </div> */}

          {/* Espaço para AdSense */}
          <div className="w-full h-24 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 mb-8">
            <span className="text-slate-500 font-semibold text-lg">Publicidade</span>
          </div>

          {/* Produtos afiliados do banco */}
          <AfiliadosList />

    </>
  );
}
