import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: List all articles from a category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "reviews";

    const supabase = createAdminClient();

    const { data: articles, error } = await supabase
      .from("articles")
      .select("*")
      .eq("category", category)
      .eq("status", "published")
      .order("published_date", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ files: [] });
    }

    // Transform to match expected format
    const files = articles.map((article) => ({
      slug: article.slug,
      filename: `${article.slug}.mdx`,
      title: article.title,
      description: article.description || "",
      date: article.published_date || "",
      category: article.category,
      image: article.image || "",
      frontmatter: {
        title: article.title,
        description: article.description,
        date: article.published_date,
        category: article.category,
        image: article.image,
        author: article.author,
        readTime: article.read_time,
      },
      contentLength: article.content?.length || 0,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json(
      { error: "Failed to list articles" },
      { status: 500 }
    );
  }
}

// POST: Create or update an article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, slug, frontmatter, content } = body;

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category and slug are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Upsert article
    const { data, error } = await supabase
      .from("articles")
      .upsert(
        {
          slug,
          category,
          title: frontmatter.title || slug,
          description: frontmatter.description || "",
          content: content || "",
          image: frontmatter.image || "",
          author: frontmatter.author || "FujiViewTech",
          read_time: frontmatter.readTime || "5 min",
          published_date:
            frontmatter.date || new Date().toISOString().split("T")[0],
          status: "published",
        },
        { onConflict: "slug,category" }
      )
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article saved successfully",
      slug,
      data,
    });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json(
      { error: "Failed to save article" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an article
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!category || !slug) {
      return NextResponse.json(
        { error: "Category and slug are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("slug", slug)
      .eq("category", category);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
