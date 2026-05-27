"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

const categoryLabels: Record<string, string> = {
  reviews: "Reviews",
  produtos: "Produtos",
  noticias: "Notícias",
  novidades: "Novidades",
};

type ArticleCard = {
  label: string;
  article: Article;
};

export default function ArtigosEmGrid() {
  const [cards, setCards] = useState<ArticleCard[]>([]);

  useEffect(() => {
    async function fetchRecentArticles() {
      try {
        const articles = await getArticles({ limit: 8 });
        // pula o mais recente (index 0), pega os próximos 7
        const from1 = articles.slice(1, 8);
        setCards(
          from1.map((a) => ({
            label: categoryLabels[a.category] ?? a.category,
            article: a,
          })),
        );
      } catch {
        setCards([]);
      }
    }

    fetchRecentArticles();
  }, []);

  const firstCard = cards[0] ?? null;
  const remainingCards = cards.slice(1, 7);

  function renderCompactCard(card: ArticleCard, index: number) {
    const summary = card.article.excerpt || card.article.description || "";
    const hasInsetDivider = index % 2 === 0;
    const hasInsetHorizontalDivider = index > 2;

    return (
      <div
        key={`${card.article.slug}-${index}`}
        className="relative bg-white/95 overflow-hidden border-t border-slate-100"
      >
        {hasInsetDivider && (
          <span className="absolute left-0 top-3 bottom-3 w-px bg-slate-900/70" />
        )}
        {hasInsetHorizontalDivider && (
          <span className="absolute top-0 left-3 right-3 h-px bg-slate-900/70" />
        )}
        <Link href={`/artigos/${card.article.slug}`} className="block h-full">
          <div className="min-w-0 p-3">
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
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 border border-black-100 border-r-0">
        {firstCard && (
          <div className="order-2 lg:order-1 col-span-2 lg:col-span-1 lg:border-r border-slate-200 bg-white/90">
            <div className="overflow-hidden h-full">
              <Link
                href={`/artigos/${firstCard.article.slug}`}
                className="block h-full"
              >
                <div className="p-2">
                  <div className="relative w-full h-44 md:h-52 bg-slate-100">
                    <Image
                      src={firstCard.article.image || "/images/placeholder.jpg"}
                      alt={firstCard.article.title || "Imagem do artigo"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 25vw"
                    />
                  </div>
                </div>
                <div className="p-3">
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
            </div>
          </div>
        )}

        <div className="order-1 lg:order-2 col-span-2 grid grid-cols-2">
          {remainingCards.map((card, index) =>
            renderCompactCard(card, index + 1),
          )}
        </div>
      </div>
    </div>
  );
}
