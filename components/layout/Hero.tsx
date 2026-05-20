import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";

import React, { useEffect, useState } from "react";
import InitialBlock from "@/components/home/InitialBlock";
import OutrasPostagens from "@/components/home/OutrasPostagens";
import LivePrices from "./LivePrices";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

export default function Hero() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [noticiasArticles, setNoticiasArticles] = useState<Article[]>([]);
  const [novidadesArticles, setNovidadesArticles] = useState<Article[]>([]);
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
              normalizedCategory !== "noticias"
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

        const novidades: Article[] = await getArticles({
          category: "novidades",
          limit: 5,
        });
        setNovidadesArticles(novidades);

        // Buscar todos para os cards genéricos
        const all: Article[] = await getArticles({ limit: 20 });
        setAllArticles(all);
      } catch {
        setLatestArticles([]);
        setNoticiasArticles([]);
        setNovidadesArticles([]);
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
        {/* Bloco inicial (abaixo do LivePrices e acima de Outras Postagens) */}
        <InitialBlock
          latestArticles={latestArticles}
          noticiasArticles={noticiasArticles}
          novidadesArticles={novidadesArticles}
        />

        {/* Bloco de Outras Postagens com imagem acima e texto abaixo */}
        {latestArticles.length > 0 && (
          <>
            <div className="full-width-bg bg-gradient-to-b from-gray-950 to-gray-800 py-3 md:py-4">
              <div className="content-inset">
                <OutrasPostagens
                  artigos={allArticles}
                  title="OUTRAS POSTAGENS"
                  excludeCategories={["noticias"]}
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
      </div>
    </>
  );
}
