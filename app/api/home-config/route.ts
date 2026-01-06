import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

const TABLE = "home_config";
const SINGLE_ID = 1;

type HomeConfig = {
  article_slugs: string[] | null;
  afiliado_ids: string[] | null;
};

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .select("article_slugs, afiliado_ids")
      .eq("id", SINGLE_ID)
      .single();

    if (error) {
      return NextResponse.json({ article_slugs: [], afiliado_ids: [] }, { status: 200 });
    }

    return NextResponse.json({
      article_slugs: data?.article_slugs || [],
      afiliado_ids: data?.afiliado_ids || [],
    });
  } catch (error) {
    console.error("Home config GET error", error);
    return NextResponse.json({ article_slugs: [], afiliado_ids: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleSlugs: string[] = Array.isArray(body.articleSlugs) ? body.articleSlugs : [];
    const afiliadoIds: string[] = Array.isArray(body.afiliadoIds) ? body.afiliadoIds : [];

    const supabase = createSupabaseAdmin();
    const { error, data } = await supabase
      .from(TABLE)
      .upsert(
        {
          id: SINGLE_ID,
          article_slugs: articleSlugs,
          afiliado_ids: afiliadoIds,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Home config POST error", error);
    return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 });
  }
}
