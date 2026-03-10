import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";

import React, { useEffect, useState } from "react";
import FilmSeriesBlock from "@/components/home/FilmSeriesBlock";
import InitialBlock from "@/components/home/InitialBlock";
import TravelBlock from "@/components/home/TravelBlock";
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
        const articles: Article[] = await getArticles({ limit: 20 });
        const latestWithoutNewsAndEconomy = articles
          .filter((article) => {
            const normalizedCategory = (article.category || "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .toLowerCase();

            return (
              article.status === "published" &&
              normalizedCategory !== "noticias" &&
              normalizedCategory !== "economia" &&
              normalizedCategory !== "viagens" &&
              normalizedCategory !== "filmes-e-series"
            );
          })
          .sort((a, b) => {
            const dateA = a.publishedAt || a.createdAt;
            const dateB = b.publishedAt || b.createdAt;
            const timeA = dateA ? new Date(dateA).getTime() : 0;
            const timeB = dateB ? new Date(dateB).getTime() : 0;
            return timeB - timeA;
          })
          .slice(0, 5);

        setLatestArticles(latestWithoutNewsAndEconomy);
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
          limit: 12,
        });
        setViagensArticles(viagens);
        const filmesSeries: Article[] = await getArticles({
          category: "filmes-e-series",
          limit: 12,
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
      <div className="z-40 -mt-13 md:mt-2 mb-5 bg-white py-0.5 justify-center flex items-center rounded-sm shadow-md border border-slate-200">
        <LivePrices />
      </div>
      <div className="px-1 md:px-0">
        {/* Bloco inicial (abaixo do LivePrices e acima de Últimas Postagens) */}
        <InitialBlock
          latestArticles={latestArticles}
          noticiasArticles={noticiasArticles}
          economiaArticles={economiaArticles}
        />

        {/* Bloco de últimas postagens com imagem acima e texto abaixo */}
        {latestArticles.length > 0 && (
          <>
            <div className="full-width-bg bg-gray-300 py-3 md:py-4">
              <div className="content-inset">
                <UltimasPostagensCarrossel
                  artigos={allArticles}
                  title="OUTRAS POSTAGENS"
                  excludeCategories={[
                    "noticias",
                    "economia",
                    "viagens",
                    "filmes-e-series",
                  ]}
                />
              </div>
            </div>
            <hr className="my-8 border-slate-500 mb-4 md:mb-6" />
          </>
        )}

        {/* Espaço para bloco de publicidade */}
        <div className="w-full h-24 flex items-center justify-center bg-slate-100 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>

        {/* Carrossel de afiliados */}
        {/* Linha divisória */}
        <hr className="my-8 border-slate-900 mb-4 md:mb-6" />

        <div className="full-width-bg bg-gray-100 py-3 md:py-4">
          <div className="content-inset">
            <AfiliadosCarrossel />
          </div>
        </div>
        <hr className="my-8 border-slate-900   mb-4 md:mb-6" />

        <TravelBlock viagensArticles={viagensArticles} />
        {/* Linha divisória */}
        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* Produtos afiliados abaixo do carrossel de viagens */}
        <div className="full-width-bg bg-gray-100 py-3 md:py-4">
          <div className="content-inset">
            <AfiliadosCarrossel />
          </div>
        </div>

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />
        {/* -------------------------------------------------Espaço para AdSense----------------------------------------------- */}
        <div className=" w-full h-24 flex items-center justify-center bg-slate-100 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>

        {/* --------------------------------------------------TV, FILMES & SÉRIES---------------------------------------------- */}

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        <FilmSeriesBlock filmesSeriesArticles={filmesSeriesArticles} />

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* Produtos afiliados abaixo do carrossel de filmes-séries */}
        <div className="full-width-bg bg-gray-100 py-3 md:py-4">
          <div className="content-inset">
            <AfiliadosCarrossel />
          </div>
        </div>

        <hr className="my-8 border-slate-200 mb-4 md:mb-6" />

        {/* -------------------------------------------------Espaço para AdSense----------------------------------------------- */}
        <div className=" w-full h-24 flex items-center justify-center bg-slate-100 mb-8">
          <span className="text-slate-500 font-semibold text-lg">
            Publicidade
          </span>
        </div>
      </div>
    </>
  );
}
