"use client";
import { useEffect, useState } from "react";

// Função utilitária para buscar categorias do dashboard
async function fetchDashboardCategorias(): Promise<any[]> {
  const res = await fetch("/api/dashboard/categorias");
  const data = await res.json();
  // Log para debug
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[Dashboard] API categorias resposta bruta:", data);
  }
  return data;
}

interface CategoriaInfo {
  categoria: string;
  totalArtigos: number;
  totalVisualizacoes: number;
  artigosMes: number;
  artigosSemana: number;
}

export default function DashboardCategoryTable() {
  const [categorias, setCategorias] = useState<CategoriaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDashboardCategorias()
      .then((data) => {
        setCategorias(data || []);
      })
      .catch((e) => {
        setError(e.message || "Erro de rede ou servidor");
        setCategorias([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalArtigos = categorias.reduce((acc, c) => acc + c.totalArtigos, 0);
  const totalVisualizacoes = categorias.reduce(
    (acc, c) => acc + c.totalVisualizacoes,
    0
  );
  const totalArtigosMes = categorias.reduce(
    (acc, c) => acc + (c.artigosMes || 0),
    0
  );
  const totalArtigosSemana = categorias.reduce(
    (acc, c) => acc + (c.artigosSemana || 0),
    0
  );

  if (loading) return <div className="text-[#bfc7d5]">Carregando...</div>;
  if (error) return <div className="text-red-400">Erro: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-[#23272f] rounded-xl shadow-lg text-[#e3e8f0] border border-[#353a45]">
        <thead>
          <tr className="bg-gradient-to-r from-[#7f8fa6] to-[#4b6b57] text-[#23272f] font-bold uppercase text-xs md:text-sm">
            <th className="px-2 md:px-5 py-2 md:py-3 text-left rounded-tl-xl">
              Categoria
            </th>
            <th className="px-2 md:px-5 py-2 md:py-3 text-right hidden sm:table-cell">
              Total
            </th>
            <th className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell">
              Mês
            </th>
            <th className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell">
              Semana
            </th>
            <th className="px-2 md:px-5 py-2 md:py-3 text-right rounded-tr-xl">
              Views
            </th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat, idx) => (
            <tr
              key={cat.categoria}
              className={`transition-colors ${
                idx % 2 === 0 ? "bg-[#23272f]" : "bg-[#2d313a]"
              } hover:bg-[#353a45] border-b border-[#353a45]`}
            >
              <td className="px-2 md:px-5 py-2 md:py-3 font-medium text-xs md:text-sm">
                {cat.categoria}
              </td>
              <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden sm:table-cell text-xs md:text-sm">
                {cat.totalArtigos}
              </td>
              <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell text-xs md:text-sm">
                {cat.artigosMes}
              </td>
              <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell text-xs md:text-sm">
                {cat.artigosSemana}
              </td>
              <td className="px-2 md:px-5 py-2 md:py-3 text-right text-xs md:text-sm font-semibold">
                {cat.totalVisualizacoes}
              </td>
            </tr>
          ))}
          <tr className="font-bold bg-gradient-to-r from-[#353a45] to-[#23272f] text-[#7f8fa6]">
            <td className="px-2 md:px-5 py-2 md:py-3 rounded-bl-xl text-xs md:text-sm">
              Total
            </td>
            <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden sm:table-cell text-xs md:text-sm">
              {totalArtigos}
            </td>
            <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell text-xs md:text-sm">
              {totalArtigosMes}
            </td>
            <td className="px-2 md:px-5 py-2 md:py-3 text-right hidden md:table-cell text-xs md:text-sm">
              {totalArtigosSemana}
            </td>
            <td className="px-2 md:px-5 py-2 md:py-3 text-right rounded-br-xl text-xs md:text-sm">
              {totalVisualizacoes}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
