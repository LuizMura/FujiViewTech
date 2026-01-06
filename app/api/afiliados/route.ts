import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

const TABLE_NAME = "afiliados";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from(TABLE_NAME).select("*").limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Afiliados GET error", error);
    return NextResponse.json({ error: "Erro ao carregar afiliados" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ["titulo", "descricao", "categoria", "loja", "preco", "afiliado_url", "status"];
    const missing = required.filter((key) => !body[key]);
    if (missing.length) {
      return NextResponse.json({ error: `Campos obrigatorios faltando: ${missing.join(", ")}` }, { status: 400 });
    }

    const imagensArray = Array.isArray(body.imagens)
      ? body.imagens.filter(Boolean)
      : typeof body.imagens === "string"
      ? body.imagens
          .split(/\n+/)
          .map((v: string) => v.trim())
          .filter(Boolean)
      : [];

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          ...body,
          imagens: imagensArray.length ? imagensArray : null,
          views: body.views ?? 0,
          clicks: body.clicks ?? 0,
          compras: body.compras ?? 0,
          receita: body.receita ?? 0,
          publicado_em: body.publicado_em || null,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Afiliados POST error", error);
    return NextResponse.json({ error: "Erro ao salvar afiliado" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...update } = body;
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const imagensArray = Array.isArray(update.imagens)
      ? update.imagens.filter(Boolean)
      : typeof update.imagens === "string"
      ? update.imagens
          .split(/\n+/)
          .map((v: string) => v.trim())
          .filter(Boolean)
      : undefined;

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...update,
        ...(imagensArray !== undefined ? { imagens: imagensArray.length ? imagensArray : null } : {}),
        publicado_em: update.publicado_em || null,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Afiliados PUT error", error);
    return NextResponse.json({ error: "Erro ao atualizar afiliado" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Afiliados DELETE error", error);
    return NextResponse.json({ error: "Erro ao excluir afiliado" }, { status: 500 });
  }
}
