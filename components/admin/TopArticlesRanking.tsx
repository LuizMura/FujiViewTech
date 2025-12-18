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
      } catch (e: any) {
        setError(e.message || "Erro de rede ou servidor");
        setArticles([]);
      }
      setLoading(false);
    }
    fetchTopArticles();
  }, []);

  return (
    <div className="bg-[#23272f] rounded-xl shadow-lg border border-[#353a45] p-4">
      <h3 className="text-lg font-bold text-[#7f8fa6] mb-4 text-center">Ranking: Mais Visualizados</h3>
      {loading ? (
        <div className="text-[#bfc7d5] text-center">Carregando...</div>
      ) : error ? (
        <div className="text-red-400 text-center">Erro: {error}</div>
      ) : (
        <ol className="space-y-2">
          {articles.map((art, idx) => (
            <li key={art.id} className="flex items-center gap-2 bg-[#2d313a] rounded-lg px-3 py-2 shadow-sm">
              <span className="font-bold text-[#7f8fa6] w-5 text-center">{idx + 1}</span>
              <div className="flex-1">
                <div className="font-semibold text-[#e3e8f0] truncate" title={art.title}>{art.title}</div>
                <div className="text-xs text-[#bfc7d5]">{art.category}</div>
              </div>
              <span className="font-mono text-[#bfc7d5] min-w-[2.5rem] text-right">{art.views}</span>
            </li>
          ))}
          {articles.length === 0 && (
            <li className="text-[#bfc7d5] text-center">Nenhum artigo encontrado</li>
          )}
        </ol>
      )}
    </div>
  );
}