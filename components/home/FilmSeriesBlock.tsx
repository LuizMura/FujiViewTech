import React from "react";
import ArtigosCarrossel from "@/components/home/ArtigosCarrossel";
import CategoryCard from "@/components/home/CategoryCard";
import FilmSeriesPenultimateGrid from "@/components/home/FilmSeriesPenultimateGrid";
import UltimasPostagensCarrossel from "@/components/home/UltimasPostagensCarrossel";
import { Article } from "@/lib/types/article";

type FilmSeriesBlockProps = {
  filmesSeriesArticles: Article[];
};

export default function FilmSeriesBlock({
  filmesSeriesArticles,
}: FilmSeriesBlockProps) {
  if (filmesSeriesArticles.length === 0) {
    return null;
  }

  const orderedByPublication = filmesSeriesArticles
    .filter((a) => a.status === "published")
    .slice()
    .sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      const timeA = dateA ? new Date(dateA).getTime() : 0;
      const timeB = dateB ? new Date(dateB).getTime() : 0;
      return timeB - timeA;
    });

  const total = orderedByPublication.length;
  const featuredCount = total >= 9 ? 5 : Math.max(1, Math.min(3, total - 4));
  const rightStart = featuredCount;
  const gridStart = rightStart + 2;
  const gridEnd = gridStart + 7;

  const featuredCarouselArticles = orderedByPublication.slice(0, featuredCount);
  const rightCardOne = orderedByPublication.slice(rightStart, rightStart + 1);
  const rightCardTwo = orderedByPublication.slice(
    rightStart + 1,
    rightStart + 2,
  );
  const filmSeriesGridArticles = orderedByPublication.slice(gridStart, gridEnd);
  const filmSeriesLatestArticles = orderedByPublication.slice(gridEnd);
  const filmSeriesLatestForCarousel =
    filmSeriesLatestArticles.length > 0
      ? filmSeriesLatestArticles
      : orderedByPublication.slice(rightStart + 2);

  return (
    <>
      <h2 className="text-2xl md:text-4xl text-slate-700 mb-6">
        TV, FILMES & SÉRIES
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="md:col-span-3 order-1 md:order-1">
          <div className="-mt-3 md:mt-0 relative w-full aspect-video h-[270px] md:h-[450px] rounded-sm overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <ArtigosCarrossel artigos={featuredCarouselArticles} />
          </div>

          <div className="mt-4 md:mt-6">
            <FilmSeriesPenultimateGrid
              filmesSeriesArticles={filmSeriesGridArticles}
            />
          </div>
        </div>

        <div className="md:col-span-1 order-2 md:order-2">
          <React.Suspense fallback={<div>Carregando...</div>}>
            <CategoryCard
              artigos={rightCardOne}
              category="filmes-e-series"
              label="TV, FILMES & SÉRIES"
              badgeColor="bg-rose-600"
            />
            <div className="mt-4">
              <CategoryCard
                artigos={rightCardTwo}
                category="filmes-e-series"
                label="TV, FILMES & SÉRIES"
                badgeColor="bg-rose-600"
              />
            </div>
          </React.Suspense>
        </div>
      </div>

      <div className="full-width-bg bg-amber-700/40 py-3 md:py-4 mb-8">
        <div className="content-inset">
          <UltimasPostagensCarrossel
            artigos={filmSeriesLatestForCarousel}
            skipFirstItem={false}
            title="VEJA TAMBÉM"
            includeCategories={["filmes-e-series"]}
          />
        </div>
      </div>
    </>
  );
}
