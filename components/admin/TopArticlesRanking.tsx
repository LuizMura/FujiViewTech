"use client";
import { useEffect, useState } from "react";

interface ArticleRanking {
  id: string;
  title: string;
  category: string;
  views: number;
}

export default function TopArticlesRanking() {
  const [articles, setArticles] = useState<ArticleRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopArticles() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/top-articles");
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Erro desconhecido na API");
          setArticles([]);
        } else {
          const data = await res.json();
          setArticles(data || []);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro de rede ou servidor");
        setArticles([]);
      }
      setLoading(false);
    }
    fetchTopArticles();
  }, []);

  return (
    <div className="bg-[#23272f] rounded-xl shadow-lg border border-[#353a45] p-3 md:p-4">
      <h3 className="text-base md:text-lg font-bold text-[#7f8fa6] mb-3 md:mb-4 text-center">
        Ranking: Mais Visualizados
      </h3>
      {loading ? (
        <div className="text-[#bfc7d5] text-center text-sm">Carregando...</div>
      ) : error ? (
        <div className="text-red-400 text-center text-sm">Erro: {error}</div>
      ) : (
        <ol className="space-y-2">
          {articles.map((art, idx) => (
            <li
              key={art.id}
              className="flex items-center gap-2 bg-[#2d313a] rounded-lg px-2 md:px-3 py-2 shadow-sm"
            >
              <span className="font-bold text-[#7f8fa6] w-5 text-center text-xs md:text-sm">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-[#e3e8f0] truncate text-xs md:text-sm"
                  title={art.title}
                >
                  {art.title}
                </div>
                <div className="text-xs text-[#bfc7d5] truncate">
                  {art.category}
                </div>
              </div>
              <span className="font-mono text-[#bfc7d5] min-w-[2rem] md:min-w-[2.5rem] text-right text-xs md:text-sm flex-shrink-0">
                {art.views}
              </span>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="text-[#bfc7d5] text-center text-sm">
              Nenhum artigo encontrado
            </li>
          )}
        </ol>
      )}
    </div>
  );
}
