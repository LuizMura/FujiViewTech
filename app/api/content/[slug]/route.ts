import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: Get a specific article content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "reviews";

    const supabase = createAdminClient();

    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("category", category)
      .single();

    if (error || !article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: article.slug,
      frontmatter: {
        title: article.title,
        description: article.description,
        date: article.published_date,
        category: article.category,
        image: article.image,
        author: article.author,
        readTime: article.read_time,
      },
      content: article.content,
    });
  } catch (error) {
    console.error("Error reading article:", error);
    return NextResponse.json(
      { error: "Failed to read article" },
      { status: 500 }
    );
  }
}
