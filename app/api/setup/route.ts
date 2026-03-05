import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const results = [];

    // 1. Cria o bucket "uploads" para arquivos de imagem.
    const { error: bucketError } = await supabase.storage.createBucket(
      "uploads",
      {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
      },
    );

    if (bucketError) {
      if (bucketError.message.includes("already exists")) {
        results.push("✅ Bucket 'uploads' já existe.");
      } else {
        results.push(`❌ Falha ao criar bucket: ${bucketError.message}`);
      }
    } else {
      results.push("✅ Bucket 'uploads' criado com sucesso.");
    }

    // 2. A tabela hero_content deve ser criada via SQL (setup separado).
    // Aqui validamos apenas o bucket, que costuma ser o principal bloqueio.

    return NextResponse.json({
      success: true,
      messages: results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
