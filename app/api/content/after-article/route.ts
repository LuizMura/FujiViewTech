import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface AfterArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  image: string | null;
  category: string;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function diversifyByCategory(items: AfterArticleItem[], limit: number) {
  const byCategory = new Map<string, AfterArticleItem[]>();

  items.forEach((item) => {
    const key = item.category || "Sem categoria";
    const list = byCategory.get(key) || [];
    list.push(item);
    byCategory.set(key, list);
  });

  const categories = shuffle(Array.from(byCategory.keys()));
  const selected: AfterArticleItem[] = [];
  let depth = 0;

  while (selected.length < limit && categories.length > 0) {
    let addedInRound = false;

    for (const cat of categories) {
      const list = byCategory.get(cat) || [];
      if (depth < list.length) {
        selected.push(list[depth]);
        addedInRound = true;
        if (selected.length >= limit) break;
      }
    }

    if (!addedInRound) break;
    depth += 1;
  }

  return selected.slice(0, limit);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const excludeSlug = searchParams.get("excludeSlug") || "";
    const latestLimit = Math.min(
      Number(searchParams.get("latestLimit") || 10),
      20,
    );
    const recLimit = Math.min(Number(searchParams.get("recLimit") || 15), 30);

    if (!category || !excludeSlug) {
      return NextResponse.json(
        { error: "category e excludeSlug são obrigatórios" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const [latestRes, poolRes] = await Promise.all([
      supabase
        .from("articles")
        .select("id, slug, title, excerpt, description, image, category")
        .eq("status", "published")
        .eq("category", category)
        .neq("slug", excludeSlug)
        .order("published_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(latestLimit),
      supabase
        .from("articles")
        .select("id, slug, title, excerpt, description, image, category")
        .eq("status", "published")
        .neq("slug", excludeSlug)
        .order("created_at", { ascending: false })
        .limit(180),
    ]);

    if (latestRes.error) throw latestRes.error;
    if (poolRes.error) throw poolRes.error;

    const latestByCategory = (latestRes.data || []) as AfterArticleItem[];
    const diversified = diversifyByCategory(
      (poolRes.data || []) as AfterArticleItem[],
      recLimit,
    );

    return NextResponse.json({
      latestByCategory,
      recommendations: diversified,
    });
  } catch (error) {
    console.error("Error loading after-article data:", error);
    return NextResponse.json(
      { error: "Falha ao carregar dados do after-article" },
      { status: 500 },
    );
  }
}
