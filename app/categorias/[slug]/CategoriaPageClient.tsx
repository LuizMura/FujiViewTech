"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";
import CategoriaCard from "../CategoriaCard";
import {
  getCategoryLabelBySlug,
  isFixedCategory,
  normalizeCategorySlug,
} from "@/lib/constants/categories";

type Subcategory = { name: string; slug: string };

export default function CategoriaPageClient() {
  const params = useParams() || {};
  const searchParams = useSearchParams();
  const activeSub = searchParams?.get("sub") ?? null;
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";
  const normalizedSlug = normalizeCategorySlug(slug);
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const activeSubcategory = activeSub
    ? subcategories.find((s) => s.slug === activeSub)?.name || activeSub
    : undefined;

  useEffect(() => {
    if (!normalizedSlug || !isFixedCategory(normalizedSlug)) return;
    fetch(`/api/content/subcategories?category=${normalizedSlug}`)
      .then((r) => r.json())
      .then((d) => setSubcategories(d.items ?? []))
      .catch(() => setSubcategories([]));
  }, [normalizedSlug]);

  useEffect(() => {
    async function fetchCategoria() {
      setLoading(true);
      try {
        const data = await getArticles({
          category: normalizedSlug,
          subcategory: activeSubcategory,
        });
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    if (normalizedSlug && isFixedCategory(normalizedSlug)) {
      fetchCategoria();
      return;
    }

    setLoading(false);
    setPosts([]);
  }, [normalizedSlug, activeSubcategory]);

  if (normalizedSlug && !isFixedCategory(normalizedSlug)) {
    return (
      <main className="container-custom py-12">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Categoria inválida
          </h1>
          <p className="text-slate-500">
            Esta categoria não existe no novo modelo do site.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-custom py-12">
      <div className="mt-5 mb-6">
        <h1 className="text-4xl font-bold text-slate-100 mb-4 capitalize">
          {getCategoryLabelBySlug(normalizedSlug)}
          {activeSub && subcategories.find((s) => s.slug === activeSub) && (
            <span className="text-2xl font-normal text-slate-400 ml-3">
              / {subcategories.find((s) => s.slug === activeSub)!.name}
            </span>
          )}
        </h1>
        <p className="text-lg text-slate-500">
          Artigos da categoria {getCategoryLabelBySlug(normalizedSlug)}
        </p>
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/categorias/${normalizedSlug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeSub
                ? "bg-[#ac3e3e] text-white"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            Todos
          </Link>
          {subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/categorias/${normalizedSlug}?sub=${sub.slug}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeSub === sub.slug
                  ? "bg-[#ac3e3e] text-white"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300"
              }`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Carregando artigos...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Nenhum artigo publicado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <CategoriaCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
