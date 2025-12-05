import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const results = [];

    // Categories to migrate
    const categories = ["reviews", "noticias", "tutoriais"];

    for (const category of categories) {
      const contentDir = path.join(process.cwd(), "content", category);

      if (!fs.existsSync(contentDir)) {
        results.push(`⚠️ Directory not found: ${category}`);
        continue;
      }

      const files = fs
        .readdirSync(contentDir)
        .filter((f) => f.endsWith(".mdx"));

      for (const filename of files) {
        const slug = filename.replace(/\.mdx?$/, "");
        const filePath = path.join(contentDir, filename);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        // Insert into Supabase
        const { error } = await supabase.from("articles").upsert(
          {
            slug,
            category,
            title: data.title || slug,
            description: data.description || "",
            content: content || "",
            image: data.image || "",
            author: data.author || "FujiViewTech",
            read_time: data.readTime || "5 min",
            published_date:
              data.date || new Date().toISOString().split("T")[0],
            status: "published",
          },
          { onConflict: "slug,category" }
        );

        if (error) {
          results.push(`❌ Failed to migrate ${category}/${slug}: ${error.message}`);
        } else {
          results.push(`✅ Migrated ${category}/${slug}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
