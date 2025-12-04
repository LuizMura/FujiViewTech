import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

interface HeroData {
  heroContent: {
    badge: string;
    mainTitle: string;
    gradientTitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    imageAlt: string;
  };
  topCard: {
    category: string;
    title: string;
    imageUrl: string;
    imageAlt: string;
    link: string;
    categoryColor: "sky" | "emerald";
  };
  bottomCard: {
    category: string;
    title: string;
    imageUrl: string;
    imageAlt: string;
    link: string;
    categoryColor: "sky" | "emerald";
  };
}

// GET: Fetch hero content from Supabase
export async function GET() {
  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { heroContent: null, topCard: null, bottomCard: null },
        { status: 200 }
      );
    }

    if (!data) {
      return NextResponse.json({
        heroContent: null,
        topCard: null,
        bottomCard: null,
      });
    }

    // Helper to get value from any casing variant
    const getVal = (key: string) => {
      const lower = key.toLowerCase();
      const snake = key.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
      return data[key] || data[lower] || data[snake] || "";
    };

    return NextResponse.json({
      heroContent: {
        badge: getVal("badge"),
        mainTitle: getVal("mainTitle"),
        gradientTitle: getVal("gradientTitle"),
        description: getVal("description"),
        buttonText: getVal("buttonText"),
        buttonLink: getVal("buttonLink"),
        imageUrl: getVal("imageUrl"),
        imageAlt: getVal("imageAlt"),
      },
      topCard: data.topCard || data.topcard || data.top_card || null,
      bottomCard: data.bottomCard || data.bottomcard || data.bottom_card || null,
    });
  } catch (error) {
    console.error("Erro ao carregar dados do hero:", error);
    return NextResponse.json(
      { heroContent: null, topCard: null, bottomCard: null },
      { status: 200 }
    );
  }
}

// POST: Save hero content to Supabase
export async function POST(request: NextRequest) {
  try {
    const body: HeroData = await request.json();
    const supabase = createSupabaseAdmin();

    // Upsert using lowercase column names (Postgres default for unquoted identifiers)
    const { data, error } = await supabase
      .from("hero_content")
      .upsert(
        {
          id: 1,
          badge: body.heroContent.badge,
          maintitle: body.heroContent.mainTitle,
          gradienttitle: body.heroContent.gradientTitle,
          description: body.heroContent.description,
          buttontext: body.heroContent.buttonText,
          buttonlink: body.heroContent.buttonLink,
          imageurl: body.heroContent.imageUrl,
          imagealt: body.heroContent.imageAlt,
          topcard: body.topCard,
          bottomcard: body.bottomCard,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dados salvos com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Erro ao salvar dados do hero:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}
