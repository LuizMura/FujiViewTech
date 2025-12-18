"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArticles } from "@/lib/hooks/useArticles";
import { Article } from "@/lib/types/article";
import CategoriaCard from "../CategoriaCard";

export default function CategoriaPage() {
  const params = useParams() || {};
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoria() {
      setLoading(true);
      try {
        const data = await getArticles({ category: slug });
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchCategoria();
  }, [slug]);

  return (
    <main className="container-custom py-12">
      <div className="mt-5 mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 capitalize">
          {slug}
        </h1>
        <p className="text-lg text-slate-600">Artigos da categoria {slug}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Carregando artigos...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Nenhum artigo publicado ainda.</p>
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
