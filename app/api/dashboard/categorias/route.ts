import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Busca total de artigos e visualizações por categoria
    // Supabase não suporta alias direto em select com group, então usamos select múltiplo e renomeamos depois
    const { data: stats, error: statsError } = await supabase
      .from("articles")
      .select("category, views, created_at")
      .neq("category", "");

    if (statsError) {
      console.error("[API dashboard/categorias] Supabase error:", statsError);
      return NextResponse.json(
        { error: statsError.message, details: statsError },
        { status: 500 },
      );
    }

    // Datas de referência
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo

    const categoriaMap: Record<
      string,
      {
        totalArtigos: number;
        totalVisualizacoes: number;
        artigosMes: number;
        artigosSemana: number;
      }
    > = {};
    (stats || []).forEach(
      (row: { category?: string; views?: number; created_at?: string }) => {
        if (!row.category) return;
        if (!categoriaMap[row.category]) {
          categoriaMap[row.category] = {
            totalArtigos: 0,
            totalVisualizacoes: 0,
            artigosMes: 0,
            artigosSemana: 0,
          };
        }
        categoriaMap[row.category].totalArtigos += 1;
        categoriaMap[row.category].totalVisualizacoes += row.views || 0;
        const createdAt = row.created_at ? new Date(row.created_at) : null;
        if (createdAt) {
          if (createdAt >= startOfMonth) {
            categoriaMap[row.category].artigosMes += 1;
          }
          if (createdAt >= startOfWeek) {
            categoriaMap[row.category].artigosSemana += 1;
          }
        }
      },
    );

    const resultFinal = Object.entries(categoriaMap).map(
      ([categoria, valores]) => ({
        categoria,
        totalArtigos: valores.totalArtigos,
        totalVisualizacoes: valores.totalVisualizacoes,
        artigosMes: valores.artigosMes,
        artigosSemana: valores.artigosSemana,
      }),
    );

    return NextResponse.json(resultFinal);

    // (removido: código morto)
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
