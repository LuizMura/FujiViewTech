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
      // PGRST116 = no rows returned
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

    return NextResponse.json({
      heroContent: {
        badge: data.badge,
        mainTitle: data.mainTitle,
        gradientTitle: data.gradientTitle,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
      },
      topCard: data.topCard || null,
      bottomCard: data.bottomCard || null,
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

    // Upsert (insert or update) the hero content
    const { data, error } = await supabase
      .from("hero_content")
      .upsert(
        {
          id: 1,
          badge: body.heroContent.badge,
          mainTitle: body.heroContent.mainTitle,
          gradientTitle: body.heroContent.gradientTitle,
          description: body.heroContent.description,
          buttonText: body.heroContent.buttonText,
          buttonLink: body.heroContent.buttonLink,
          imageUrl: body.heroContent.imageUrl,
          imageAlt: body.heroContent.imageAlt,
          topCard: body.topCard,
          bottomCard: body.bottomCard,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao salvar dados no banco" },
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
