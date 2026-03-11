import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: Lista artigos publicados de uma categoria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "reviews";
    const subcategory = searchParams.get("subcategory") || "";

    const supabase = createAdminClient();

    let query = supabase
      .from("articles")
      .select("*")
      .eq("category", category)
      .eq("status", "published")
      .order("published_date", { ascending: false });

    if (subcategory) {
      query = query.eq("subcategory", subcategory);
    }

    const { data: articles, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ files: [] });
    }

    // Normaliza a resposta para o formato consumido pelo admin.
    const files = articles.map((article) => ({
      slug: article.slug,
      filename: `${article.slug}.mdx`,
      title: article.title,
      description: article.description || "",
      date: article.published_date || "",
      category: article.category,
      subcategory: article.subcategory || "geral",
      image: article.image || "",
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
      contentLength: article.content?.length || 0,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json(
      { error: "Falha ao listar artigos" },
      { status: 500 },
    );
  }
}

// POST: Cria ou atualiza um artigo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, slug, frontmatter, content } = body;
    const subcategory =
      String(body?.subcategory || frontmatter?.subcategory || "geral").trim() ||
      "geral";

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category e slug são obrigatórios" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const articlePayload = {
      slug,
      category,
      subcategory,
      title: frontmatter.title || slug,
      description: frontmatter.description || "",
      content: content || "",
      image: frontmatter.image || "",
      author: frontmatter.author || "Redação FujivewTech",
      read_time: frontmatter.readTime || "5 min",
      published_date:
        frontmatter.date || new Date().toISOString().split("T")[0],
      status: "published",
    };

    // 1) Tenta localizar pelo trio slug+category+subcategory.
    const { data: existingByScope, error: findScopedError } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .eq("category", category)
      .eq("subcategory", subcategory)
      .maybeSingle();

    if (findScopedError) {
      console.error("Supabase find scoped error:", findScopedError);
      return NextResponse.json(
        { error: findScopedError.message, details: findScopedError },
        { status: 500 },
      );
    }

    // 2) Compatibilidade com bancos que ainda têm unique por slug apenas.
    let existing = existingByScope;
    if (!existing?.id) {
      const { data: existingBySlug, error: findSlugError } = await supabase
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (findSlugError) {
        console.error("Supabase find slug error:", findSlugError);
        return NextResponse.json(
          { error: findSlugError.message, details: findSlugError },
          { status: 500 },
        );
      }

      existing = existingBySlug;
    }

    let data;
    let error;

    if (existing?.id) {
      const result = await supabase
        .from("articles")
        .update(articlePayload)
        .eq("id", existing.id)
        .select();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("articles")
        .insert(articlePayload)
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Supabase save error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Artigo salvo com sucesso",
      slug,
      data,
    });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json(
      { error: "Falha ao salvar artigo" },
      { status: 500 },
    );
  }
}

// DELETE: Remove um artigo por slug e categoria
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");
    const subcategory = searchParams.get("subcategory") || "";

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category e slug são obrigatórios" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    let query = supabase
      .from("articles")
      .delete()
      .eq("slug", slug)
      .eq("category", category);

    if (subcategory) {
      query = query.eq("subcategory", subcategory);
    }

    const { error } = await query;

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Artigo excluído com sucesso",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Falha ao excluir artigo" },
      { status: 500 },
    );
  }
}
