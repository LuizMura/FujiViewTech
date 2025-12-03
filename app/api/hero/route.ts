import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

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

const DATA_FILE = join(process.cwd(), "public", "data", "hero.json");

// GET: Retorna os dados salvos
export async function GET() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // Se o arquivo não existir, retorna vazio para usar defaults
    return NextResponse.json({
      heroContent: null,
      topCard: null,
      bottomCard: null,
    });
  }
}

// POST: Salva os dados
export async function POST(request: NextRequest) {
  try {
    const body: HeroData = await request.json();

    // Garante que o diretório existe
    await mkdir(join(process.cwd(), "public", "data"), { recursive: true });

    // Salva o arquivo
    await writeFile(DATA_FILE, JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: "Dados salvos com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao salvar dados do hero:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}
