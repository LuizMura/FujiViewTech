import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCategoryLabelBySlug } from "@/lib/constants/categories";

const siteTitle = "FujiviewTech";
const siteDescription =
  "FujiviewTech — Portal de tecnologia com Reviews, Produtos, Notícias e Novidades.";
const defaultOgImage = "/images/og-default.png";

type ArticleSeoRow = {
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  image: string | null;
  category: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  status: string;
};

async function getArticleSeo(slug: string): Promise<ArticleSeoRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "slug, title, description, excerpt, image, category, meta_title, meta_description, og_image, status",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    return null;
  }

  return Array.isArray(data) && data.length > 0
    ? (data[0] as ArticleSeoRow)
    : null;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleSeo(slug);

  if (!article) {
    return {
      title: `Artigo | ${siteTitle}`,
      description: siteDescription,
    };
  }

  const title = article.meta_title || article.title;
  const description =
    article.meta_description ||
    article.description ||
    article.excerpt ||
    siteDescription;
  const image = article.og_image || article.image || defaultOgImage;
  const categoryLabel =
    getCategoryLabelBySlug(article.category || "") || "Artigos";
  const url = `/artigos/${encodeURIComponent(article.slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: siteTitle,
      locale: "pt_BR",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    category: categoryLabel,
  };
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
