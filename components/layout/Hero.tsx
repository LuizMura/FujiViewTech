import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";

import React, { useEffect, useState } from "react";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import CategoryCard from "@/components/home/CategoryCard";
import UltimasPostagensCarrossel from "@/components/home/UltimasPostagensCarrossel";
import LivePrices from "./LivePrices";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

export default function Hero() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [noticiasArticles, setNoticiasArticles] = useState<Article[]>([]);
  const [economiaArticles, setEconomiaArticles] = useState<Article[]>([]);
  const [viagensArticles, setViagensArticles] = useState<Article[]>([]);
  const [filmesSeriesArticles, setFilmesSeriesArticles] = useState<Article[]>(
    [],
  );
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
        const viagens: Article[] = await getArticles({
          category: "viagens",
          limit: 5,
        });
        setViagensArticles(viagens);
        const filmesSeries: Article[] = await getArticles({
          category: "filmes-e-series",
          limit: 5,
        });
        setFilmesSeriesArticles(filmesSeries);
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
      {/* ---------------------------------------------------------LIVEPRICES----------------------------------------------- */}
      <div className="z-40 -mt-13 md:mt-2 mb-5 bg-white py-0.5 justify-center flex items-center rounded-none md:rounded-2xl shadow-md border border-slate-200">
        <LivePrices />
      </div>
      <div className="px-1 md:px-0">
        {/* ---------------------------------------------------5 últimos artigos postados em carrossel----------------------------------------------- */}
        {latestArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8">
              <div className="md:col-span-2 order-1 md:order-1">
                <div className="-mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
                  <ArtigosCarrossel artigos={latestArticles} />
                </div>
              </div>

              {/* ---------------------------------------------------Notícias e Economia----------------------------------------------- */}
              <div className="order-2 md:order-2">
                <React.Suspense fallback={<div>Carregando...</div>}>
                  <CategoryCard
                    artigos={noticiasArticles}
                    category="noticias"
                    label="Notícias"
                    badgeColor="bg-indigo-600"
                  />
                  <div className="mt-4">
                    <CategoryCard
                      artigos={economiaArticles}
                      category="economia"
                      label="Economia"
                      badgeColor="bg-green-600"
                    />
                  </div>
                </React.Suspense>
              </div>
            </div>

            {/* ----------------------------------Cards do UltimasPostagensCarrossel com imagem acima e texto abaixo----------------- */}
            <hr className="my-8 border-slate-200 mb-4 md:mb-6" />
            <UltimasPostagensCarrossel artigos={allArticles} />
            <hr className="my-8 border-slate-200 mb-4 md:mb-6" />
          </>
        )}

        {/* ---------------------------------------------------Espaço para AdSense----------------------------------------------- */}
        <div className="w-full h-24 flex items-center justify-center bg-slate-100 rounded-md border border-slate-200 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>

        {/* ---------------------------------------------------AFILIADOS CARROSSEL---------------------------------------------- */}
        {/* Linha divisória */}
        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        <AfiliadosCarrossel />
        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* ---------------------------------------------------VIAGENS & TURISMO---------------------------------------------- */}
        <h2 className="px-3 text-2xl md:text-4xl text-slate-100 mb-6">
          VIAGENS & TURISMO
        </h2>

        {viagensArticles.length > 0 && (
          <div className=" -mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 mb-8">
            <ArtigosCarrossel artigos={viagensArticles} />
          </div>
        )}

        {/* Cards do UltimasPostagensCarrossel para categoria viagens */}
        {viagensArticles.length > 0 && (
          <div className="mb-8">
            <UltimasPostagensCarrossel artigos={viagensArticles} />
          </div>
        )}
        {/* Linha divisória */}
        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* Produtos afiliados abaixo do carrossel de viagens */}
        <AfiliadosCarrossel />

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />
        {/* -------------------------------------------------Espaço para AdSense----------------------------------------------- */}
        <div className=" w-full h-24 flex items-center justify-center bg-slate-100 rounded-md border border-slate-200 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>

        {/* --------------------------------------------------TV, FILMES & SÉRIES---------------------------------------------- */}

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        <h2 className="text-2xl md:text-4xl text-slate-100 mb-6">
          TV, FILMES & SÉRIES
        </h2>

        {filmesSeriesArticles.length > 0 && (
          <div className="-mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 mb-8">
            <ArtigosCarrossel artigos={filmesSeriesArticles} />
          </div>
        )}

        {/* Cards do UltimasPostagensCarrossel para categoria filmes-e-series */}
        {filmesSeriesArticles.length > 0 && (
          <div className="mb-8">
            <UltimasPostagensCarrossel artigos={filmesSeriesArticles} />
          </div>
        )}

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* Produtos afiliados abaixo do carrossel de filmes-séries */}
        <AfiliadosCarrossel />

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* -------------------------------------------------Espaço para AdSense----------------------------------------------- */}
        <div className=" w-full h-24 flex items-center justify-center bg-slate-100 rounded-md border border-slate-200 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>
      </div>
    </>
  );
}
