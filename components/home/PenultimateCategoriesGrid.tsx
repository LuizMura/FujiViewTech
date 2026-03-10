"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

const penultimateCategoryList = [
  { slug: "dicas", label: "Dicas" },
  { slug: "produtos", label: "Produtos" },
  { slug: "novidades", label: "Novidades" },
  { slug: "reviews", label: "Reviews" },
  { slug: "tutoriais", label: "Tutoriais" },
  { slug: "saude", label: "Saúde" },
  { slug: "noticias", label: "Notícias" },
];

type PenultimateCategoryCard = {
  slug: string;
  label: string;
  article: Article | null;
};

export default function PenultimateCategoriesGrid() {
  const [cards, setCards] = useState<PenultimateCategoryCard[]>([]);

  useEffect(() => {
    async function fetchPenultimateByCategory() {
      try {
        const penultimateByCategory: PenultimateCategoryCard[] =
          await Promise.all(
            penultimateCategoryList.map(async (categoryItem) => {
              const categoryArticles = await getArticles({
                category: categoryItem.slug,
                limit: 2,
              });

              return {
                ...categoryItem,
                article: categoryArticles[1] ?? null,
              };
            }),
          );

        setCards(penultimateByCategory);
      } catch {
        setCards([]);
      }
    }

    fetchPenultimateByCategory();
  }, []);

  const firstCard = cards[0] ?? null;
  const remainingCards = cards.slice(1, 7);

  function renderCompactCard(card: PenultimateCategoryCard, index: number) {
    const summary = card.article?.excerpt || card.article?.description || "";
    const hasInsetDivider = index % 2 === 0;
    const hasInsetHorizontalDivider = index > 2;

    return (
      <div
        key={`${card.slug}-${index}`}
        className="relative bg-white overflow-hidden border-t border-slate-200 sm:border-t-0"
      >
        {hasInsetDivider && (
          <span className="hidden sm:block absolute left-0 top-3 bottom-3 w-px bg-slate-200" />
        )}
        {hasInsetHorizontalDivider && (
          <span className="hidden sm:block absolute top-0 left-3 right-3 h-px bg-slate-200" />
        )}
        {card.article ? (
          <Link href={`/artigos/${card.article.slug}`} className="block h-full">
            <div className="min-w-0 p-3">
              <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 px-2 py-0.5 mb-1">
                {card.label}
              </p>
              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                {card.article.title}
              </h3>
              {summary && (
                <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-2">
                  {summary}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="min-w-0 p-3">
            <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 px-2 py-0.5 mb-1">
              {card.label}
            </p>
            <p className="text-sm text-slate-600 line-clamp-2">
              Ainda não há penúltimo artigo nesta categoria.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 border border-slate-300 lg:border-r-0 bg-white">
        {firstCard && (
          <div className="lg:col-span-1 lg:border-r border-slate-200">
            <div className="overflow-hidden h-full">
              {firstCard.article ? (
                <Link
                  href={`/artigos/${firstCard.article.slug}`}
                  className="block h-full"
                >
                  <div className="p-2">
                    <div className="relative w-full h-44 md:h-52 bg-slate-100">
                      <Image
                        src={
                          firstCard.article.image || "/images/placeholder.jpg"
                        }
                        alt={firstCard.article.title || "Imagem do artigo"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                      />
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 px-2 py-0.5 mb-1">
                      {firstCard.label}
                    </p>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 leading-snug line-clamp-3">
                      {firstCard.article.title}
                    </h3>
                    {(firstCard.article.excerpt ||
                      firstCard.article.description) && (
                      <p className="mt-1 text-xs text-slate-600 leading-snug line-clamp-3">
                        {firstCard.article.excerpt ||
                          firstCard.article.description}
                      </p>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="h-full">
                  <div className="p-2">
                    <div className="w-full h-44 md:h-52 bg-slate-100" />
                  </div>
                  <div className="p-3">
                    <p className="inline-block text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 px-2 py-0.5 mb-1">
                      {firstCard.label}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      Ainda não há penúltimo artigo nesta categoria.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2">
          {remainingCards.map((card, index) =>
            renderCompactCard(card, index + 1),
          )}
        </div>
      </div>
    </div>
  );
}
