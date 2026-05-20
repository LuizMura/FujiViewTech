import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isFixedCategory,
  normalizeCategorySlug,
} from "@/lib/constants/categories";

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category") || "";
    const category = normalizeCategorySlug(categoryParam);
    const includeUnusedParam = String(
      searchParams.get("includeUnused") || "",
    ).toLowerCase();
    const includeUnused =
      includeUnusedParam === "1" || includeUnusedParam === "true";

    const supabase = createAdminClient();

    // Por padrão, retorna apenas subcategorias realmente usadas em artigos publicados,
    // evitando exibir itens órfãos (ex.: nome antigo já renomeado nos artigos).
    if (category && !includeUnused) {
      if (!isFixedCategory(category)) {
        return NextResponse.json(
          { error: "Categoria invalida" },
          { status: 400 },
        );
      }

      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("subcategory")
        .eq("category", category)
        .eq("status", "published");

      if (articlesError) {
        return NextResponse.json(
          { error: articlesError.message },
          { status: 500 },
        );
      }

      const names = Array.from(
        new Set(
          (articles || [])
            .map((row) => String(row?.subcategory || "").trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "pt-BR"));

      const items = names.map((name) => ({
        id: null,
        category,
        name,
        slug: toSlug(name),
        created_at: null,
      }));

      return NextResponse.json({ items });
    }

    let query = supabase
      .from("article_subcategories")
      .select("id, category, name, slug, created_at")
      .order("name", { ascending: true });

    if (category) {
      if (!isFixedCategory(category)) {
        return NextResponse.json(
          { error: "Categoria invalida" },
          { status: 400 },
        );
      }
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error("Error loading subcategories:", error);
    return NextResponse.json(
      { error: "Falha ao listar subcategorias" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawCategory = String(body?.category || "");
    const rawName = String(body?.name || "").trim();

    const category = normalizeCategorySlug(rawCategory);

    if (!isFixedCategory(category)) {
      return NextResponse.json(
        { error: "Categoria invalida" },
        { status: 400 },
      );
    }

    if (!rawName) {
      return NextResponse.json(
        { error: "Nome da subcategoria e obrigatorio" },
        { status: 400 },
      );
    }

    const slug = toSlug(rawName);

    if (!slug) {
      return NextResponse.json(
        { error: "Nome da subcategoria invalido" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("article_subcategories")
      .upsert(
        {
          category,
          name: rawName,
          slug,
        },
        { onConflict: "category,slug" },
      )
      .select("id, category, name, slug, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json(
      { error: "Falha ao criar subcategoria" },
      { status: 500 },
    );
  }
}
