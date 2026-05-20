import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import CategoriaPageClient from "./CategoriaPageClient";
import {
  getCategoryLabelBySlug,
  isFixedCategory,
  normalizeCategorySlug,
} from "@/lib/constants/categories";
const siteTitle = "FujiviewTech";
const siteDescription =
  "FujiviewTech — Portal de tecnologia com Reviews, Produtos, Notícias e Novidades.";
const ogImage = "/images/og-default.png";

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getPublishedSubcategories(category: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("subcategory")
    .eq("category", category)
    .eq("status", "published");

  if (error) {
    return [] as Array<{ name: string; slug: string }>;
  }

  const names = Array.from(
    new Set(
      (data || [])
        .map((row) => String(row?.subcategory || "").trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  return names.map((name) => ({ name, slug: toSlug(name) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sub?: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const normalizedSlug = normalizeCategorySlug(slug);
  const activeSubSlug = String(searchParams?.sub || "").trim();

  if (!isFixedCategory(normalizedSlug)) {
    return {
      title: `Categoria | ${siteTitle}`,
      description: siteDescription,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryLabel = getCategoryLabelBySlug(normalizedSlug);
  const subcategories = activeSubSlug
    ? await getPublishedSubcategories(normalizedSlug)
    : [];
  const activeSub = subcategories.find((sub) => sub.slug === activeSubSlug);
  const title = activeSub
    ? `${activeSub.name} em ${categoryLabel} | ${siteTitle}`
    : `${categoryLabel} | ${siteTitle}`;
  const description = activeSub
    ? `Artigos da subcategoria ${activeSub.name} em ${categoryLabel} no ${siteTitle}.`
    : `Artigos da categoria ${categoryLabel} no ${siteTitle}. Reviews, análises, notícias e novidades de tecnologia.`;
  const url = activeSub
    ? `/categorias/${normalizedSlug}?sub=${encodeURIComponent(activeSub.slug)}`
    : `/categorias/${normalizedSlug}`;

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
      type: "website",
      siteName: siteTitle,
      locale: "pt_BR",
      images: [
        {
          url: ogImage,
          alt: activeSub
            ? `${siteTitle} - ${categoryLabel} - ${activeSub.name}`
            : `${siteTitle} - ${categoryLabel}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    category: activeSub
      ? `${categoryLabel} / ${activeSub.name}`
      : categoryLabel,
  };
}

export default function CategoriaPage() {
  return <CategoriaPageClient />;
}
