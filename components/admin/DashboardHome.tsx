"use client";

import { useEffect, useState } from "react";
import PerformanceChart from "./PerformanceChart";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";

function getCategoryColor(idx: number) {
  // Paleta fixa de 4 cores
  const palette = ["#3b82f6", "#10b981", "#f59e42", "#ef4444"];
  return palette[idx % palette.length];
}

export default function DashboardHome() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const data = await getArticles();
        setArticles(data);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Estatísticas
  const total = articles.length;
  const categories = Array.from(
    new Set(articles.map((a) => a.category))
  ).filter(Boolean);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  function isPublishedThisMonth(article: Article) {
    if (!article.publishedAt) return false;
    const date = new Date(article.publishedAt);
    return date >= startOfMonth && date <= now;
  }
  function isPublishedThisWeek(article: Article) {
    if (!article.publishedAt) return false;
    const date = new Date(article.publishedAt);
    return date >= startOfWeek && date <= now;
  }

  const articlesByCategory = categories.map((cat, idx) => {
    const all = articles.filter((a) => a.category === cat);
    const month = all.filter(isPublishedThisMonth);
    const week = all.filter(isPublishedThisWeek);
    return {
      category: cat,
      count: all.length,
      monthCount: month.length,
      weekCount: week.length,
      color: getCategoryColor(idx),
    };
  });

  const viewsTotal = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const viewsByCategory = categories.map((cat, idx) => ({
    category: cat,
    views: articles
      .filter((a) => a.category === cat)
      .reduce((acc, a) => acc + (a.views || 0), 0),
    color: getCategoryColor(idx),
  }));
  const topArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  // Alertas detalhados
  const drafts = articles.filter((a) => a.status === "draft");
  const archived = articles.filter((a) => a.status === "archived");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="bg-[#23232a] rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Categorias e Estatísticas
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#18181b]">
                  <th className="px-4 py-2 text-gray-300 font-semibold rounded-l-lg">
                    Categoria
                  </th>
                  <th className="px-4 py-2 text-gray-300 font-semibold">
                    Total de Artigos
                  </th>
                  <th className="px-4 py-2 text-gray-300 font-semibold">
                    Publicados no Mês
                  </th>
                  <th className="px-4 py-2 text-gray-300 font-semibold">
                    Publicados na Semana
                  </th>
                  <th className="px-4 py-2 text-gray-300 font-semibold rounded-r-lg">
                    Visualizações
                  </th>
                </tr>
              </thead>
              <tbody>
                {articlesByCategory.map(
                  ({ category, count, monthCount, weekCount, color }) => {
                    // Busca visualizações por categoria
                    const views = articles
                      .filter((a) => a.category === category)
                      .reduce((acc, a) => acc + (a.views || 0), 0);
                    return (
                      <tr
                        key={category}
                        className="bg-[#18181b] hover:bg-[#23232a] transition"
                      >
                        <td className="px-4 py-2 font-bold text-white rounded-l-lg">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ background: color }}
                          ></span>
                          {category}
                        </td>
                        <td className="px-4 py-2 text-blue-300">{count}</td>
                        <td className="px-4 py-2 text-green-400">
                          {monthCount}
                        </td>
                        <td className="px-4 py-2 text-yellow-300">
                          {weekCount}
                        </td>
                        <td className="px-4 py-2 text-purple-400 rounded-r-lg">
                          {views}
                        </td>
                      </tr>
                    );
                  }
                )}
                {/* Linha de total */}
                <tr className="bg-blue-950 font-bold">
                  <td className="px-4 py-2 text-white rounded-l-lg">Total</td>
                  <td className="px-4 py-2 text-blue-300">
                    {articlesByCategory.reduce((acc, c) => acc + c.count, 0)}
                  </td>
                  <td className="px-4 py-2 text-green-400">
                    {articlesByCategory.reduce(
                      (acc, c) => acc + c.monthCount,
                      0
                    )}
                  </td>
                  <td className="px-4 py-2 text-yellow-300">
                    {articlesByCategory.reduce(
                      (acc, c) => acc + c.weekCount,
                      0
                    )}
                  </td>
                  <td className="px-4 py-2 text-purple-400 rounded-r-lg">
                    {articlesByCategory.reduce(
                      (acc, c) =>
                        acc +
                        articles
                          .filter((a) => a.category === c.category)
                          .reduce((v, a) => v + (a.views || 0), 0),
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Painel de desempenho: gráfico dos últimos 3 meses */}
          <div className="mt-8 mb-8 max-w-4xl mx-auto">
            <div className="bg-[#18181b] rounded-lg px-8 py-6 w-full text-center shadow-lg overflow-x-auto">
              <PerformanceChart articles={articles} />
            </div>
            {/* Ranking dos 10 artigos mais visualizados */}
            <div className="mt-8 mb-8">
              <div className="bg-[#18181b] rounded-lg px-8 py-6 w-full text-center shadow-lg overflow-x-auto">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ranking: 10 artigos mais visualizados
                </h3>
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-[#23232a]">
                      <th className="px-4 py-2 text-gray-300 font-semibold rounded-l-lg">
                        Artigo
                      </th>
                      <th className="px-4 py-2 text-gray-300 font-semibold">
                        Categoria
                      </th>
                      <th className="px-4 py-2 text-gray-300 font-semibold rounded-r-lg">
                        Visualizações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...articles]
                      .sort((a, b) => (b.views || 0) - (a.views || 0))
                      .slice(0, 10)
                      .map((a) => (
                        <tr
                          key={a.id}
                          className="bg-[#18181b] hover:bg-[#23232a] transition"
                        >
                          <td className="px-4 py-2 text-blue-400 font-bold rounded-l-lg">
                            {a.title}
                          </td>
                          <td className="px-4 py-2 text-gray-300">
                            {a.category}
                          </td>
                          <td className="px-4 py-2 text-green-400 font-bold rounded-r-lg">
                            {a.views}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-400">Carregando estatísticas...</div>
      ) : (
        <>
          {/* Alertas detalhados */}
          {(drafts.length > 0 || archived.length > 0) && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Alertas
              </h3>
              {drafts.length > 0 && (
                <div className="mb-2">
                  <span className="font-bold text-yellow-300">Rascunhos:</span>
                  <ul className="list-disc pl-6 text-gray-200">
                    {drafts.map((a) => (
                      <li key={a.id}>{a.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {archived.length > 0 && (
                <div>
                  <span className="font-bold text-red-400">Arquivados:</span>
                  <ul className="list-disc pl-6 text-gray-200">
                    {archived.map((a) => (
                      <li key={a.id}>{a.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
