"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { incrementClicks } from "@/lib/hooks/useArticles";
import AfiliadosCarrossel from "@/components/home/AfiliadosCarrossel";
import AdSense from "@/components/AdSense";

interface AfterArticleProps {
  category?: string | null;
  currentSlug?: string;
}

interface AfterArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  image: string | null;
  category: string;
}

export default function AfterArticle({
  category,
  currentSlug,
}: AfterArticleProps) {
  const [articles, setArticles] = useState<AfterArticleItem[]>([]);
  const [interestArticles, setInterestArticles] = useState<AfterArticleItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadingInterest, setLoadingInterest] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchAfterArticleData() {
      if (!category) {
        setArticles([]);
        setInterestArticles([]);
        setLoading(false);
        setLoadingInterest(false);
        return;
      }

      setLoading(true);
      setLoadingInterest(true);

      try {
        const query = new URLSearchParams({
          category,
          excludeSlug: currentSlug || "",
          latestLimit: "10",
          recLimit: "15",
        });

        const response = await fetch(`/api/content/after-article?${query}`, {
          signal: abortController.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar after-article");
        }

        const payload = (await response.json()) as {
          latestByCategory?: AfterArticleItem[];
          recommendations?: AfterArticleItem[];
        };

        setArticles(payload.latestByCategory || []);
        setInterestArticles(payload.recommendations || []);
      } catch (err) {
        if (abortController.signal.aborted) return;
        console.error("Error fetching latest category articles:", err);
        setArticles([]);
        setInterestArticles([]);
      } finally {
        if (abortController.signal.aborted) return;
        setLoading(false);
        setLoadingInterest(false);
      }
    }

    fetchAfterArticleData();

    return () => {
      abortController.abort();
    };
  }, [category, currentSlug]);

  if (!category) return null;

  const handleBackToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArticleClick = (slug: string) => {
    void incrementClicks(slug);
  };

  return (
    <aside className="py-4 bg-white rounded-lg mt-0 md:ml-4">
      <h4 className="mb-4 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-slate-700">
        VEJA TAMBÉM:
      </h4>

      {loading ? (
        <div className="text-sm sm:text-base text-slate-500">Carregando...</div>
      ) : articles.length === 0 ? (
        <div className="text-sm sm:text-base text-slate-500">
          Nenhum outro artigo publicado nesta categoria.
        </div>
      ) : (
        <ol className="list-none space-y-2 text-base">
          {articles.map((article) => (
            <li
              key={article.id}
              className="font-semibold py-2 flex items-start gap-2"
            >
              <span className="text-green-700 leading-6 text-base sm:text-lg">
                &gt;
              </span>
              <Link
                href={`/artigos/${article.slug}`}
                onClick={() => handleArticleClick(article.slug)}
                className="text-sm sm:text-base text-slate-800 hover:text-indigo-600 line-clamp-2"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 border-b border-slate-200" />

      <h4 className="mt-10 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide text-slate-700">
        TALVEZ VOCÊ POSSA SE INTERESSAR:
      </h4>

      {loadingInterest ? (
        <div className="mt-4 text-sm sm:text-base text-slate-500">
          Carregando...
        </div>
      ) : interestArticles.length === 0 ? (
        <div className="mt-4 text-sm sm:text-base text-slate-500">
          Nenhum artigo disponível no momento.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interestArticles.slice(0, 15).map((item) => (
            <Link
              key={item.id}
              href={`/artigos/${item.slug}`}
              onClick={() => handleArticleClick(item.slug)}
              className="group block border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-full h-36 bg-slate-100 overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={640}
                    height={360}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="p-3">
                <h5 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2">
                  {item.title}
                </h5>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3">
                  {item.excerpt ||
                    item.description ||
                    "Leia este conteúdo completo."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 border-b border-slate-200" />

      <div className="mt-6">
        <AfiliadosCarrossel
          title="AFILIADOS"
          emptyMessage=""
          smallArrows
          compact
        />
      </div>

      <div className="mt-6 p-3 border border-slate-200 rounded-sm bg-slate-50 min-h-[120px]">
        <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 text-center">
          Publicidade
        </p>
        <AdSense slot="5566778899" />
      </div>

      <div className="mt-16 text-center text-sm sm:text-base font-semibold text-slate-700">
        <button
          type="button"
          onClick={handleBackToTop}
          className="hover:text-indigo-600 transition-colors"
        >
          VOLTAR AO TOPO
        </button>
        <span className="mx-2 text-slate-400">|</span>
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          PÁGINA INICIAL
        </Link>
      </div>
    </aside>
  );
}
