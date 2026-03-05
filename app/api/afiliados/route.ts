import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TABLE_NAME = "afiliados";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Helper: converte número para formato pt-BR (ex: 4999.99 -> "R$ 4.999,99")
    const formatPtBRMoney = (v: unknown): string => {
      if (typeof v === "number" && Number.isFinite(v)) {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(v);
      }
      if (typeof v === "string") return v;
      return "R$ 0,00";
    };

    // Normaliza a chave da imagem: usa `imagem` (minúsculo) no payload da API
    // E formata valores monetários de volta para string formatada
    const normalized = (data || []).map((row: Record<string, unknown>) => ({
      ...row,
      imagem: row.imagem || row.Imagem || null,
      button_color:
        String(row.button_color || "")
          .trim()
          .toLowerCase() === "#3b82f6"
          ? "#ac3e3e"
          : row.button_color || "#ac3e3e",
      preco: formatPtBRMoney(row.preco),
      receita: formatPtBRMoney(row.receita),
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Afiliados GET error", error);
    return NextResponse.json(
      { error: "Erro ao carregar afiliados" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = [
      "titulo",
      "descricao",
      "categoria",
      "loja",
      "preco",
      "afiliado_url",
      "status",
    ];
    const missing = required.filter((key) => !body[key]);
    if (missing.length) {
      return NextResponse.json(
        { error: `Campos obrigatorios faltando: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // Helper: converte valores monetários pt-BR (ex: "R$ 6.099,00") para número (6099.00)
    const parsePtBRMoney = (v: unknown): number | null => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v !== "string") return null;
      const trimmed = v.trim();
      if (!trimmed) return null;
      const cleaned = trimmed
        .replace(/\s/g, "")
        .replace(/^R\$/i, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : null;
    };

    // Normaliza imagens recebidas (opcional) e define uma imagem de capa
    const imagensArray = Array.isArray(body.imagens)
      ? body.imagens.filter(Boolean)
      : typeof body.imagens === "string"
        ? body.imagens
            .split(/\n+/)
            .map((v: string) => v.trim())
            .filter(Boolean)
        : [];
    const imagemCapa = body.imagem || imagensArray[0] || null;

    // Garante que não enviaremos chaves conflitantes
    const rest = { ...(body as Record<string, unknown>) };
    delete rest.imagem;
    delete rest.imagens;
    delete rest.Imagem;

    // Converte campos numéricos que podem vir formatados como string
    const precoParsed = parsePtBRMoney(rest.preco);
    if (precoParsed === null) {
      return NextResponse.json(
        { error: "Preço inválido. Use formato como 'R$ 1.234,56' ou 1234.56." },
        { status: 400 },
      );
    }
    const receitaParsed =
      rest.receita !== undefined ? parsePtBRMoney(rest.receita) : 0;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          ...rest,
          preco: precoParsed,
          imagem: imagemCapa,
          button_text: body.button_text || "COMPRAR",
          button_color: body.button_color || "#ac3e3e",
          views: body.views ?? 0,
          clicks: body.clicks ?? 0,
          compras: body.compras ?? 0,
          receita: receitaParsed ?? 0,
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
    return NextResponse.json(
      { error: "Erro ao salvar afiliado" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...update } = body;
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    // Helper: converte valores monetários pt-BR (ex: "R$ 6.099,00") para número (6099.00)
    const parsePtBRMoney = (v: unknown): number | null => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v !== "string") return null;
      const trimmed = v.trim();
      if (!trimmed) return null;
      const cleaned = trimmed
        .replace(/\s/g, "")
        .replace(/^R\$/i, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : null;
    };

    const imagensArray = Array.isArray(update.imagens)
      ? update.imagens.filter(Boolean)
      : typeof update.imagens === "string"
        ? update.imagens
            .split(/\n+/)
            .map((v: string) => v.trim())
            .filter(Boolean)
        : undefined;
    const imagemCapa =
      update.imagem || (imagensArray && imagensArray[0]) || undefined;

    // Remove chaves inconsistentes
    const updateRest = { ...(update as Record<string, unknown>) };
    delete updateRest.imagem;
    delete updateRest.imagens;
    delete updateRest.Imagem;
    const updateRecord = update as Record<string, unknown>;

    const buttonTextInput =
      typeof updateRecord.button_text === "string"
        ? updateRecord.button_text
        : undefined;
    const buttonColorInput =
      typeof updateRecord.button_color === "string"
        ? updateRecord.button_color
        : undefined;
    const publishedAtInput =
      typeof updateRecord.publicado_em === "string"
        ? updateRecord.publicado_em
        : null;

    // Converte se `preco` vier como string formatada
    if (updateRest.preco !== undefined) {
      const parsed = parsePtBRMoney(updateRest.preco);
      if (parsed === null) {
        return NextResponse.json(
          {
            error: "Preço inválido. Use formato como 'R$ 1.234,56' ou 1234.56.",
          },
          { status: 400 },
        );
      }
      updateRest.preco = parsed;
    }
    if (updateRest.receita !== undefined) {
      const parsed = parsePtBRMoney(updateRest.receita);
      updateRest.receita = parsed ?? 0;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...updateRest,
        ...(imagemCapa !== undefined ? { imagem: imagemCapa } : {}),
        button_text:
          buttonTextInput || String(updateRest.button_text || "COMPRAR"),
        button_color:
          buttonColorInput || String(updateRest.button_color || "#ac3e3e"),
        publicado_em: publishedAtInput,
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
    return NextResponse.json(
      { error: "Erro ao atualizar afiliado" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Afiliados DELETE error", error);
    return NextResponse.json(
      { error: "Erro ao excluir afiliado" },
      { status: 500 },
    );
  }
}
