import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isFixedCategory,
  normalizeCategorySlug,
} from "@/lib/constants/categories";

// GET: Lista artigos publicados de uma categoria
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category") || "";
    const category = normalizeCategorySlug(categoryParam);
    const subcategory = String(searchParams.get("subcategory") || "").trim();

    const supabase = createAdminClient();

    let query = supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_date", { ascending: false });

    if (category) {
      if (!isFixedCategory(category)) {
        return NextResponse.json(
          { error: "Categoria invalida" },
          { status: 400 },
        );
      }
      query = query.eq("category", category);
    }

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
      tags: article.tags || [],
      brand: article.brand || null,
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
    const rawCategory = String(body?.category || "");
    const category = normalizeCategorySlug(rawCategory);
    const slug = String(body?.slug || "").trim();
    const frontmatter = body?.frontmatter || {};
    const content = body?.content || "";
    const subcategory =
      String(body?.subcategory || frontmatter?.subcategory || "geral").trim() ||
      "geral";
    const hasTagsField = Object.prototype.hasOwnProperty.call(
      body || {},
      "tags",
    );
    const hasBrandField =
      Object.prototype.hasOwnProperty.call(body || {}, "brand") ||
      Object.prototype.hasOwnProperty.call(frontmatter || {}, "brand");
    const tags: string[] = Array.isArray(body?.tags)
      ? body.tags.map(String).filter(Boolean)
      : [];
    const brand =
      String(body?.brand || frontmatter?.brand || "").trim() || null;
    const status = String(body?.status || "published")
      .trim()
      .toLowerCase();

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category e slug são obrigatórios" },
        { status: 400 },
      );
    }

    if (!isFixedCategory(category)) {
      return NextResponse.json(
        {
          error:
            "Categoria invalida. Use: reviews, produtos, noticias ou novidades.",
        },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const articlePayloadBase = {
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
      status:
        status === "draft" || status === "archived" || status === "published"
          ? status
          : "published",
    };

    const articlePayload: Record<string, unknown> = {
      ...articlePayloadBase,
    };

    // tags/brand sao opcionais para manter retrocompatibilidade com bancos
    // que ainda nao receberam a migration dessas colunas.
    if (hasTagsField) {
      articlePayload.tags = tags;
    }

    if (hasBrandField) {
      articlePayload.brand = brand;
    }

    const normalizedSubcategorySlug = subcategory
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (normalizedSubcategorySlug) {
      await supabase.from("article_subcategories").upsert(
        {
          category,
          name: subcategory,
          slug: normalizedSubcategorySlug,
        },
        { onConflict: "category,slug" },
      );
    }

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

    const saveArticle = async (payload: Record<string, unknown>) => {
      if (existing?.id) {
        return await supabase
          .from("articles")
          .update(payload)
          .eq("id", existing.id)
          .select();
      }

      return await supabase.from("articles").insert(payload).select();
    };

    let { data, error } = await saveArticle(articlePayload);

    // Fallback para bancos sem colunas opcionais (tags/brand).
    if (
      error?.code === "42703" &&
      (String(error.message || "").includes("tags") ||
        String(error.message || "").includes("brand"))
    ) {
      const { data: fallbackData, error: fallbackError } =
        await saveArticle(articlePayloadBase);
      data = fallbackData;
      error = fallbackError;
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
    const categoryParam = searchParams.get("category") || "";
    const category = normalizeCategorySlug(categoryParam);
    const slug = searchParams.get("slug");
    const subcategory = searchParams.get("subcategory") || "";

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category e slug são obrigatórios" },
        { status: 400 },
      );
    }

    if (!isFixedCategory(category)) {
      return NextResponse.json(
        { error: "Categoria invalida" },
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
