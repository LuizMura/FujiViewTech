"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Article,
  ArticleDB,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleFilters,
  DashboardStats,
  articleFromDB,
  articleToDB,
} from "@/lib/types/article";

// =====================================================
// CRUD Operations
// =====================================================

/**
 * Buscar todos os artigos com filtros
 */
export async function getArticles(
  filters?: ArticleFilters
): Promise<Article[]> {
  const supabase = createClient();

  let query = supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  // Aplicar filtros
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`
    );
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }

  return (data as ArticleDB[]).map(articleFromDB);
}

/**
 * Buscar artigo por ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }

  return data ? articleFromDB(data as ArticleDB) : null;
}

/**
 * Buscar artigo por slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching article by slug:", error?.message || error);
    return null;
  }

  if (!data) return null;
  return articleFromDB(data as ArticleDB);
}

/**
 * Criar novo artigo
 */
export async function createArticle(
  input: CreateArticleInput
): Promise<Article> {
  const supabase = createClient();

  const dbData = articleToDB(input);


  const { data, error } = await supabase
    .from("articles")
    .insert([dbData])
    .select();

  if (error) {
    console.error("Error creating article:", error);
    try {
      // Tenta logar o erro como JSON
      console.error("Supabase error JSON:", JSON.stringify(error, null, 2));
    } catch {}
    throw error;
  }
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error("Nenhum artigo retornado após criação.");
  }
  console.log("✅ Article created:", data[0].id, data[0].title);
  return articleFromDB(data[0] as ArticleDB);
}

/**
 * Atualizar artigo
 */
export async function updateArticle(
  input: UpdateArticleInput
): Promise<Article> {
  const supabase = createClient();

  const { id, ...updateData } = input;
  const dbData = articleToDB(updateData as CreateArticleInput);

  const { data, error } = await supabase
    .from("articles")
    .update(dbData)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error updating article:", error?.message || error);
    throw error;
  }
  if (!data) {
    // Se não retornou, busca manualmente
    const { data: fetched, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchError || !fetched) {
      throw new Error("Nenhum artigo retornado após atualização.");
    }
    console.log("✅ Article updated (fetched):", fetched.id, fetched.title);
    return articleFromDB(fetched as ArticleDB);
  }
  console.log("✅ Article updated:", data.id, data.title);
  return articleFromDB(data as ArticleDB);
}

/**
 * Deletar artigo
 */
export async function deleteArticle(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    console.error("Error deleting article:", error);
    throw error;
  }

  console.log("✅ Article deleted:", id);
}

/**
 * Publicar artigo (mudar status para published)
 */
export async function publishArticle(id: string): Promise<Article> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error publishing article:", error);
    throw error;
  }

  console.log("✅ Article published:", data.id, data.title);
  return articleFromDB(data as ArticleDB);
}

/**
 * Arquivar artigo
 */
export async function archiveArticle(id: string): Promise<Article> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .update({ status: "archived" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error archiving article:", error);
    throw error;
  }

  console.log("✅ Article archived:", data.id);
  return articleFromDB(data as ArticleDB);
}

/**
 * Duplicar artigo
 */
export async function duplicateArticle(id: string): Promise<Article> {
  const original = await getArticleById(id);

  if (!original) {
    throw new Error("Article not found");
  }

  const duplicate: CreateArticleInput = {
    title: `${original.title} (cópia)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    excerpt: original.excerpt || undefined,
    content: original.content || undefined,
    image: original.image || undefined,
    category: original.category,
    status: "draft",
    titleColor: original.titleColor,
    titleFontSize: original.titleFontSize,
    excerptColor: original.excerptColor,
    excerptFontSize: original.excerptFontSize,
    bgColor: original.bgColor,
    bgOpacity: original.bgOpacity,
    showButton: original.showButton,
    buttonText: original.buttonText,
    buttonBgColor: original.buttonBgColor,
    buttonTextColor: original.buttonTextColor,
    buttonFontSize: original.buttonFontSize,
    buttonBorderRadius: original.buttonBorderRadius,
    metaTitle: original.metaTitle || undefined,
    metaDescription: original.metaDescription || undefined,
    ogImage: original.ogImage || undefined,
    subComponent: original.subComponent || undefined,
    readTime: original.readTime,
  };

  return createArticle(duplicate);
}

// =====================================================
// Analytics
// =====================================================

/**
 * Incrementar visualizações
 */
export async function incrementViews(slug: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_article_views", {
    article_slug: slug,
  });

  if (error) {
    console.error("Error incrementing views:", error);
  }
}

/**
 * Incrementar cliques
 */
export async function incrementClicks(slug: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("increment_article_clicks", {
    article_slug: slug,
  });

  if (error) {
    console.error("Error incrementing clicks:", error);
  }
}

/**
 * Obter estatísticas do dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("dashboard_summary")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      publishedCount: 0,
      draftCount: 0,
      archivedCount: 0,
      totalViews: 0,
      totalClicks: 0,
      categoriesCount: 0,
    };
  }

  return {
    publishedCount: data.published_count || 0,
    draftCount: data.draft_count || 0,
    archivedCount: data.archived_count || 0,
    totalViews: data.total_views || 0,
    totalClicks: data.total_clicks || 0,
    categoriesCount: data.categories_count || 0,
  };
}

// =====================================================
// Validações
// =====================================================

/**
 * Verificar se slug já existe
 */
export async function slugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = createClient();

  let query = supabase.from("articles").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query;

  return (data?.length || 0) > 0;
}

/**
 * Gerar slug único a partir do título
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
