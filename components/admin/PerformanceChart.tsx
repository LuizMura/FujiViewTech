import { useMemo } from "react";

interface PerformanceChartProps {
  articles: Array<{ publishedAt: string | null; views: number }>;
}

// Simples gráfico de barras usando apenas divs (sem libs externas)
export default function PerformanceChart({ articles }: PerformanceChartProps) {
  // Calcula os últimos 3 meses
  const now = new Date();
  const months = [
    new Date(now.getFullYear(), now.getMonth() - 2, 1),
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    new Date(now.getFullYear(), now.getMonth(), 1),
  ];
  const monthLabels = months.map((d) =>
    d.toLocaleString("pt-BR", { month: "short", year: "2-digit" })
  );

  // Soma visualizações por mês
  const viewsByMonth = useMemo(() => {
    return months.map((start, idx) => {
      const end =
        idx < months.length - 1
          ? months[idx + 1]
          : new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return articles
        .filter(
          (a) =>
            a.publishedAt &&
            new Date(a.publishedAt) >= start &&
            new Date(a.publishedAt) < end
        )
        .reduce((acc, a) => acc + (a.views || 0), 0);
    });
  }, [articles]);

  const maxViews = Math.max(...viewsByMonth, 1);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Desempenho: Visualizações dos últimos 3 meses
      </h3>
      <div className="flex items-end gap-6 h-32 mb-2">
        {viewsByMonth.map((views, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-end h-full"
          >
            <div
              style={{
                height: `${(views / maxViews) * 100}%`,
                background: "#3b82f6",
                width: "32px",
                borderRadius: "8px",
              }}
              className="mb-2"
            ></div>
            <span className="text-xs text-gray-300 font-bold capitalize">
              {monthLabels[idx]}
            </span>
            <span className="text-xs text-gray-400">{views}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
