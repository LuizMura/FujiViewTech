import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: Retorna conteúdo de um artigo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "reviews";
    const subcategory = searchParams.get("subcategory") || "";

    const supabase = createAdminClient();

    let query = supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("category", category)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (subcategory) {
      query = query.eq("subcategory", subcategory);
    }

    const { data, error } = await query;
    const article = Array.isArray(data) ? data[0] : null;

    if (error || !article) {
      return NextResponse.json(
        { error: "Artigo não encontrado" },
        { status: 404 },
      );
    }

    // Mantém metadados + conteúdo no formato esperado pelo editor.
    return NextResponse.json({
      id: article.id,
      slug: article.slug,
      frontmatter: {
        title: article.title,
        description: article.description,
        date: article.published_date,
        category: article.category,
        subcategory: article.subcategory || "geral",
        image: article.image,
        author: article.author,
        readTime: article.read_time,
      },
      content: article.content,
    });
  } catch (error) {
    console.error("Error reading article:", error);
    return NextResponse.json({ error: "Falha ao ler artigo" }, { status: 500 });
  }
}
