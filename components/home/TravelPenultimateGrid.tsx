import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/lib/types/article";

type TravelPenultimateGridProps = {
  viagensArticles: Article[];
};

export default function TravelPenultimateGrid({
  viagensArticles,
}: TravelPenultimateGridProps) {
  const sorted = viagensArticles
    .filter((a) => a.status === "published")
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  // Usa os primeiros 7 itens da lista recebida.
  const penultimateTravel = sorted.slice(0, 7);

  if (penultimateTravel.length === 0) {
    return null;
  }

  const firstCard = penultimateTravel[0] ?? null;
  const remainingCards = penultimateTravel.slice(1, 7);

  function renderCompactCard(article: Article) {
    const summary = article.excerpt || article.description || "";

    return (
      <div
        key={article.id}
        className="relative bg-white overflow-hidden border-t border-slate-200 sm:border-t-0"
      >
        <span className="hidden sm:block absolute top-0 left-3 right-3 h-px bg-slate-200" />
        <Link href={`/artigos/${article.slug}`} className="block h-full">
          <div className="min-w-0 p-3">
            <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-sky-100 px-2 py-0.5 mb-1">
              Viagens
            </p>
            <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {article.title}
            </h3>
            {summary && (
              <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-2">
                {summary}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 border border-slate-300 lg:border-r-0 bg-white">
        {firstCard && (
          <div className="lg:col-span-1 lg:border-r border-slate-200">
            <div className="overflow-hidden h-full">
              <Link
                href={`/artigos/${firstCard.slug}`}
                className="block h-full"
              >
                <div className="p-2">
                  <div className="relative w-full h-44 md:h-52 bg-slate-100">
                    <Image
                      src={firstCard.image || "/images/placeholder.jpg"}
                      alt={firstCard.title || "Imagem do artigo"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                  </div>
                </div>

                <div className="p-3">
                  <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-sky-100 px-2 py-0.5 mb-1">
                    Viagens
                  </p>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug line-clamp-3">
                    {firstCard.title}
                  </h3>
                  {(firstCard.excerpt || firstCard.description) && (
                    <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-3">
                      {firstCard.excerpt || firstCard.description}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 sm:[&>*:nth-child(2n)]:border-l sm:[&>*:nth-child(2n)]:border-slate-200">
          {remainingCards.map((article) => renderCompactCard(article))}
        </div>
      </div>
    </div>
  );
}
