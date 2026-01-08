import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHero } from "@/app/context/HeroContext";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import NoticiasCard from "@/components/home/NoticiasCard";
import EconomiaCard from "@/components/home/EconomiaCard";
import UltimasPostagensCarrossel from "@/components/home/UltimasPostagensCarrossel";
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
        const noticias: Article[] = await getArticles({
          category: "noticias",
          limit: 5,
        });
        setNoticiasArticles(noticias);
        const economia: Article[] = await getArticles({
          category: "economia",
          limit: 5,
        });
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
      <div className="z-40 -mt-13 md:mt-2 mb-5 bg-white py-1 justify-center flex items-center rounded-none md:rounded-2xl shadow-md border border-slate-200">
        <LivePrices />
      </div>
      {/* 5 últimos artigos postados em carrossel */}
      {latestArticles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8">
            <div className="md:col-span-2 order-1 md:order-1">
              <div className="-mt-4 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-none md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                <ArtigosCarrossel artigos={latestArticles} />
              </div>
            </div>
            <div className="order-2 md:order-2">
              {/* Notícias da categoria 'noticias' */}
              <React.Suspense fallback={<div>Carregando notícia...</div>}>
                <NoticiasCard artigos={noticiasArticles} />
                <div className="mt-4">
                  <EconomiaCard artigos={economiaArticles} />
                </div>
              </React.Suspense>
            </div>
          </div>

          {/* Cards do UltimasPostagensCarrossel com imagem acima e texto abaixo */}
          <div className="mb-8">
            <UltimasPostagensCarrossel artigos={allArticles} />
          </div>
        </>
      )}

      {/* Espaço para AdSense */}
      <div className="w-full h-24 flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200 mb-8">
        <span className="text-slate-500 font-semibold text-lg">
          Publicidade
        </span>
      </div>

      {/* Produtos afiliados do banco */}
      <AfiliadosCarrossel />
    </>
  );
}
