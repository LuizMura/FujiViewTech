import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Valida se o arquivo enviado é uma imagem.
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Limita o tamanho para 5MB para evitar uploads pesados.
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gera nome único com timestamp para reduzir risco de colisão.
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `image-${timestamp}.${ext}`;

    // Envia o arquivo para o bucket público "uploads".
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 },
      );
    }

    // Retorna a URL pública para uso imediato no front-end.
    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
